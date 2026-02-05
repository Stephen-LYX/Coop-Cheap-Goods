"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { Users, ShoppingBag, Plus, Search } from "lucide-react";

interface Coop {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  member_count: number;
  created_at: string;
}

interface UserCoop extends Coop {
  role: string;
}

export default function CoopsPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [allCoops, setAllCoops] = useState<Coop[]>([]);
  const [userCoops, setUserCoops] = useState<UserCoop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my-coops" | "discover">("my-coops");

  const categories = [
    "All",
    "Clothing",
    "Electronics",
    "Furniture",
    "Books",
    "Sports & Outdoors",
    "Toys & Games",
    "Home & Garden",
    "Automotive",
    "Music & Instruments",
    "Other",
  ];

  useEffect(() => {
    if (user) {
      fetchCoops();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCoops = async () => {
    setLoading(true);

    // Fetch user's coops
    const { data: userCoopsData } = await supabase
      .from("coop_members")
      .select(`
        role,
        coops (
          id,
          name,
          description,
          category,
          image_url,
          member_count,
          created_at
        )
      `)
      .eq("user_id", user?.id);

    if (userCoopsData) {
      const formattedUserCoops = userCoopsData.map((item: any) => ({
        ...item.coops,
        role: item.role,
      }));
      setUserCoops(formattedUserCoops);
    }

    // Fetch all active coops for discovery
    const { data: allCoopsData } = await supabase
      .from("coops")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (allCoopsData) {
      setAllCoops(allCoopsData);
    }

    setLoading(false);
  };

  const filteredCoops = (activeTab === "my-coops" ? userCoops : allCoops).filter(
    (coop) => {
      const matchesSearch =
        coop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coop.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || coop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  const CoopCard = ({ coop, role }: { coop: Coop; role?: string }) => (
    <div
      onClick={() => router.push(`/coop/${coop.id}`)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-200"
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-200">
        {coop.image_url ? (
          <Image
            src={`/uploads/${coop.image_url}`}
            alt={coop.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
        )}
        {role && (
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                role === "owner"
                  ? "bg-purple-100 text-purple-700"
                  : role === "moderator"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
          {coop.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {coop.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-gray-500">
            <Users size={14} />
            {coop.member_count} {coop.member_count === 1 ? "member" : "members"}
          </span>
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
            {coop.category}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading coops...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coops</h1>
            <p className="text-gray-600 mt-1">
              Join communities to buy and sell with trusted groups
            </p>
          </div>
          <button
            onClick={() => router.push("/coop/create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Create Coop
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("my-coops")}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === "my-coops"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Coops ({userCoops.length})
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === "discover"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Discover
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search coops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Coops Grid */}
        {filteredCoops.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {activeTab === "my-coops"
                ? "You haven't joined any coops yet"
                : "No coops found"}
            </h2>
            <p className="text-gray-600 mb-4">
              {activeTab === "my-coops"
                ? "Create a coop or ask for an invite to get started"
                : "Try adjusting your search or filters"}
            </p>
            {activeTab === "my-coops" && (
              <button
                onClick={() => router.push("/coop/create")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Coop
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoops.map((coop) => (
              <CoopCard
                key={coop.id}
                coop={coop}
                role={activeTab === "my-coops" ? (coop as UserCoop).role : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
