"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, UserMinus, Shield, Users, AlertCircle, Trash2 } from "lucide-react";

interface CoopMember {
  id: string;
  user_id: string;
  role: "owner" | "moderator" | "member";
  joined_at: string;
  users?: {
    email: string;
  };
}

interface CoopInvite {
  id: string;
  invitee_email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function ManageCoopPage() {
  const { id } = useParams();
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [coopName, setCoopName] = useState("");
  const [members, setMembers] = useState<CoopMember[]>([]);
  const [invites, setInvites] = useState<CoopInvite[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Invite form states
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "moderator">("member");
  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    if (id && user) {
      checkPermissionsAndFetch();
    } else if (id) {
      setLoading(false);
    }
  }, [id, user]);

  const checkPermissionsAndFetch = async () => {
    // Check if user is owner or moderator
    const { data: memberData } = await supabase
      .from("coop_members")
      .select("role")
      .eq("coop_id", id)
      .eq("user_id", user?.id)
      .single();

    if (!memberData || (memberData.role !== "owner" && memberData.role !== "moderator")) {
      router.push(`/coop/${id}`);
      return;
    }

    setUserRole(memberData.role);
    await fetchData();
  };

  const fetchData = async () => {
    setLoading(true);

    // Fetch coop name
    const { data: coopData } = await supabase
      .from("coops")
      .select("name")
      .eq("id", id)
      .single();

    if (coopData) {
      setCoopName(coopData.name);
    }

    // Fetch members
    const { data: membersData } = await supabase
      .from("coop_members")
      .select(`
        id,
        user_id,
        role,
        joined_at,
        users:user_id (email)
      `)
      .eq("coop_id", id)
      .order("joined_at", { ascending: true });

    if (membersData) {
      setMembers(membersData as any);
    }

    // Fetch pending invites
    const { data: invitesData } = await supabase
      .from("coop_invites")
      .select("*")
      .eq("coop_id", id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (invitesData) {
      setInvites(invitesData);
    }

    setLoading(false);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteMessage("");

    if (!inviteEmail) {
      setInviteMessage("Please enter an email address.");
      return;
    }

    // Check if user exists
    const { data: userData } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", inviteEmail)
      .single();

    // Check if already a member
    const { data: existingMember } = await supabase
      .from("coop_members")
      .select("id")
      .eq("coop_id", id)
      .eq("user_id", userData?.id)
      .single();

    if (existingMember) {
      setInviteMessage("This user is already a member of the coop.");
      return;
    }

    // Create invite
    const { error } = await supabase.from("coop_invites").insert([
      {
        coop_id: id,
        inviter_id: user?.id,
        invitee_email: inviteEmail,
        invitee_id: userData?.id,
        role: inviteRole,
        status: "pending",
      },
    ]);

    if (error) {
      setInviteMessage("Error sending invite: " + error.message);
    } else {
      setInviteMessage("Invite sent successfully!");
      setInviteEmail("");
      fetchData();
    }
  };

  const handleRemoveMember = async (memberId: string, memberRole: string) => {
    if (memberRole === "owner") {
      alert("Cannot remove the owner.");
      return;
    }

    if (userRole === "moderator" && memberRole === "moderator") {
      alert("Moderators cannot remove other moderators.");
      return;
    }

    if (
      !confirm("Are you sure you want to remove this member from the coop?")
    ) {
      return;
    }

    const { error } = await supabase
      .from("coop_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      alert("Error removing member: " + error.message);
    } else {
      fetchData();
    }
  };

  const handlePromoteToModerator = async (memberId: string, currentRole: string) => {
    if (userRole !== "owner") {
      alert("Only the owner can promote members to moderator.");
      return;
    }

    if (currentRole === "moderator") {
      alert("This user is already a moderator.");
      return;
    }

    const { error } = await supabase
      .from("coop_members")
      .update({ role: "moderator" })
      .eq("id", memberId);

    if (error) {
      alert("Error promoting member: " + error.message);
    } else {
      fetchData();
    }
  };

  const handleDemoteFromModerator = async (memberId: string) => {
    if (userRole !== "owner") {
      alert("Only the owner can demote moderators.");
      return;
    }

    if (!confirm("Demote this moderator to a regular member?")) {
      return;
    }

    const { error } = await supabase
      .from("coop_members")
      .update({ role: "member" })
      .eq("id", memberId);

    if (error) {
      alert("Error demoting moderator: " + error.message);
    } else {
      fetchData();
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    const { error } = await supabase
      .from("coop_invites")
      .update({ status: "expired" })
      .eq("id", inviteId);

    if (error) {
      alert("Error canceling invite: " + error.message);
    } else {
      fetchData();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push(`/coop/${id}`)}
          className="text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          ← Back to Coop
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage {coopName}
        </h1>
        <p className="text-gray-600 mb-8">
          Invite members and manage coop settings
        </p>

        {/* Send Invite Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail size={20} />
            Send Invite
          </h2>
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(e.target.value as "member" | "moderator")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="member">Member</option>
                <option value="moderator">Moderator</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Moderators can invite members and manage the coop
              </p>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Invite
            </button>
            {inviteMessage && (
              <p
                className={`text-sm ${
                  inviteMessage.includes("Error")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {inviteMessage}
              </p>
            )}
          </form>
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Invites ({invites.length})
            </h2>
            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {invite.invitee_email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Invited as {invite.role} •{" "}
                      {new Date(invite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} />
            Members ({members.length})
          </h2>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.users?.email || "Unknown user"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === "owner"
                        ? "bg-purple-100 text-purple-700"
                        : member.role === "moderator"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {userRole === "owner" &&
                    member.role === "member" && (
                      <button
                        onClick={() =>
                          handlePromoteToModerator(member.id, member.role)
                        }
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Promote to moderator"
                      >
                        <Shield size={14} />
                        Promote
                      </button>
                    )}

                  {userRole === "owner" &&
                    member.role === "moderator" && (
                      <button
                        onClick={() => handleDemoteFromModerator(member.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="Demote to member"
                      >
                        <Shield size={14} />
                        Demote
                      </button>
                    )}

                  {member.role !== "owner" &&
                    !(
                      userRole === "moderator" && member.role === "moderator"
                    ) && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.role)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove member"
                      >
                        <UserMinus size={14} />
                        Remove
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone (Owner Only) */}
        {userRole === "owner" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border-2 border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              Danger Zone
            </h2>
            <p className="text-gray-600 mb-4">
              Deleting the coop will remove all items, members, and data. This
              action cannot be undone.
            </p>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Are you ABSOLUTELY sure you want to delete this coop? This cannot be undone!"
                  )
                ) {
                  // Handle coop deletion
                  alert("Coop deletion feature coming soon");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Delete Coop
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
