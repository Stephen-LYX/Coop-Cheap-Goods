"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/component/Navbar";
import MarketplaceGrid from "@/component/MarketplaceGrid";

export default function CoopPage({ params }) {
  const { supabase, user } = useAuth();
  const coopId = params.id;

  const [coop, setCoop] = useState(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Load coop
      const { data: coopData } = await supabase
        .from("coops")
        .select("*")
        .eq("id", coopId)
        .single();

      setCoop(coopData);

      if (!user) return;

      // Check membership
      const { data: memberCheck } = await supabase
        .from("coop_members")
        .select("*")
        .eq("coop_id", coopId)
        .eq("user_id", user.id);

      setIsMember(memberCheck.length > 0);
    };

    load();
  }, [supabase, user]);

  const handleJoin = async () => {
    await supabase.from("coop_members").insert({
      coop_id: coopId,
      user_id: user.id
    });
    setIsMember(true);
  };

  const handleLeave = async () => {
    await supabase
      .from("coop_members")
      .delete()
      .eq("coop_id", coopId)
      .eq("user_id", user.id);

    setIsMember(false);
  };

  if (!coop) return <p>Loading...</p>;

  return (
    <main>
      <Navbar />

      <div className="max-w-3xl mx-auto my-10">
        <h1 className="text-4xl font-bold">{coop.name}</h1>
        <p className="text-gray-600 mt-2">{coop.description}</p>

        {user && (
          <div className="mt-6">
            {isMember ? (
              <button
                onClick={handleLeave}
                className="px-6 py-2 bg-red-600 text-white rounded-lg"
              >
                Leave Coop
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Join Coop
              </button>
            )}
          </div>
        )}

        {isMember ? (
          <div className="mt-10">
            <MarketplaceGrid coopId={coopId} />
          </div>
        ) : (
          <p className="text-gray-500 mt-10">
            Join this coop to view its items.
          </p>
        )}
      </div>
    </main>
  );
}
