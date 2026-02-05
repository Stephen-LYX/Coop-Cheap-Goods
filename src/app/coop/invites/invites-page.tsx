"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Check, X, Clock } from "lucide-react";

interface Invite {
  id: string;
  coop_id: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
  coops: {
    name: string;
    description: string;
    category: string;
  };
  inviter?: {
    email: string;
  };
}

export default function InvitesPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInvites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchInvites = async () => {
    setLoading(true);

    const { data: userProfile } = await supabase.auth.getUser();
    const userEmail = userProfile?.user?.email;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    const { data: invitesData } = await supabase
      .from("coop_invites")
      .select(`
        id,
        coop_id,
        role,
        status,
        created_at,
        expires_at,
        coops (
          name,
          description,
          category
        ),
        inviter:inviter_id (
          email
        )
      `)
      .eq("invitee_email", userEmail)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (invitesData) {
      setInvites(invitesData as any);
    }

    setLoading(false);
  };

  const handleAcceptInvite = async (invite: Invite) => {
    // Add user to coop_members
    const { error: memberError } = await supabase.from("coop_members").insert([
      {
        coop_id: invite.coop_id,
        user_id: user?.id,
        role: invite.role,
      },
    ]);

    if (memberError) {
      alert("Error joining coop: " + memberError.message);
      return;
    }

    // Update invite status
    const { error: inviteError } = await supabase
      .from("coop_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);

    if (inviteError) {
      console.error("Error updating invite:", inviteError);
    }

    // Redirect to coop
    router.push(`/coop/${invite.coop_id}`);
  };

  const handleDeclineInvite = async (inviteId: string) => {
    const { error } = await supabase
      .from("coop_invites")
      .update({ status: "declined" })
      .eq("id", inviteId);

    if (error) {
      alert("Error declining invite: " + error.message);
    } else {
      fetchInvites();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading invites...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/coop")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Coops
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Coop Invitations
        </h1>
        <p className="text-gray-600 mb-8">
          You have {invites.length} pending{" "}
          {invites.length === 1 ? "invitation" : "invitations"}
        </p>

        {invites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Mail size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No pending invitations
            </h2>
            <p className="text-gray-600">
              When someone invites you to a coop, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {invite.coops.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {invite.coops.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Invited{" "}
                        {new Date(invite.created_at).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {invite.coops.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        As {invite.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAcceptInvite(invite)}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check size={18} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineInvite(invite.id)}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X size={18} />
                    Decline
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  This invitation expires on{" "}
                  {new Date(invite.expires_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
