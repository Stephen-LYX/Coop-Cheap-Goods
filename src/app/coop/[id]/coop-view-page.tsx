"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import ItemCard from "@/components/ItemCard";
import { Users, Settings, ShoppingBag } from "lucide-react";

// Match your actual Item interface from ItemCard
interface Item {
  id: number | string;
  name: string;
  image: string;
  condition: string;
  price: number;
  user_id?: string;
  category?: string;
}

interface Coop {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  creator_id: string;
  created_at: string;
  member_count: number;
  is_active: boolean;
}

interface CoopMember {
  id: string;
  user_id: string;
  role: "owner" | "moderator" | "member";
  joined_at: string;
  users?: {
    email: string;
  };
}

export default function CoopPage() {
  const { id } = useParams();
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [coop, setCoop] = useState<Coop | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<CoopMember[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"items" | "members">("items");

  useEffect(() => {
    if (id && user) {
      fetchCoopData();
    } else if (id) {
      setLoading(false);
    }
  }, [id, user]);

  const fetchCoopData = async () => {
    setLoading(true);

    // Fetch coop details
    const { data: coopData, error: coopError } = await supabase
      .from("coops")
      .select("*")
      .eq("id", id)
      .single();

    if (coopError || !coopData) {
      console.error("Error fetching coop:", coopError);
      setLoading(false);
      return;
    }

    setCoop(coopData);

    // Check if user is a member and get their role
    const { data: memberData, error: memberError } = await supabase
      .from("coop_members")
      .select("role")
      .eq("coop_id", id)
      .eq("user_id", user?.id)
      .single();

    if (memberData) {
      setIsMember(true);
      setUserRole(memberData.role);
    }

    // Fetch coop items (only if member)
    if (memberData) {
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("id, title, image_url, condition, price, user_id, category, created_at")
        .eq("coop_id", id)
        .eq("is_coop_item", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (itemsData) {
        // Transform to match ItemCard's Item interface
        const transformedItems = itemsData.map((item: any) => ({
          id: item.id,
          name: item.title, // Your DB uses 'title', ItemCard expects 'name'
          image: item.image_url, // Your DB uses 'image_url', ItemCard expects 'image'
          condition: item.condition || "Good",
          price: item.price,
          user_id: item.user_id,
          category: item.category,
        }));
        setItems(transformedItems);
      }
    }

    // Fetch members list
    const { data: membersData, error: membersError } = await supabase
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

    setLoading(false);
  };

  const handleJoinRequest = async () => {
    // This would typically send a request or show a modal
    // For now, we'll just show an alert
    alert("Join requests feature coming soon! Ask the coop owner for an invite.");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading coop...</div>
      </main>
    );
  }

  if (!coop) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Coop not found
          </h1>
          <button
            onClick={() => router.push("/coop")}
            className="text-blue-600 hover:underline"
          >
            Browse all coops
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back
          </button>

          <div className="flex items-start gap-6">
            {/* Coop Image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {coop.image_url ? (
                <Image
                  src={`/uploads/${coop.image_url}`}
                  alt={coop.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={40} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Coop Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {coop.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{coop.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {coop.member_count} {coop.member_count === 1 ? "member" : "members"}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {coop.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {(userRole === "owner" || userRole === "moderator") && (
                    <button
                      onClick={() => router.push(`/coop/${id}/manage`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Settings size={18} />
                      Manage
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          {isMember && (
            <div className="flex gap-6 mt-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("items")}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === "items"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Items ({items.length})
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === "members"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Members ({members.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isMember ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Users size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Members Only
            </h2>
            <p className="text-gray-600">
              You need to be a member to view items and participate in this coop.
            </p>
          </div>
        ) : (
          <>
            {activeTab === "items" && (
              <>
                {items.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      No items yet
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Be the first to list an item in this coop! Go to the Sell page and select "Coop Only" to list here.
                    </p>
                    <button
                      onClick={() => router.push(`/sell`)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Go to Sell Page
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "members" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50"
                    >
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
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
