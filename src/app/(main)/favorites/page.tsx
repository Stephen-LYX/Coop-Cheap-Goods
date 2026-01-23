"use client";
import CategoryBar from "@/components/navbar/CategoryBar";
import FavoritesGrid from "../../../components/FavoriteGrid";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
export default function Favorites() {
  const { user, supabase, loading } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("🟢 Supabase session user:", data.session?.user?.id);
      console.log("🟣 AuthContext user:", user?.id);
    };
    checkUser();
  }, [supabase, user]);
  return (
    <main>
      <div className="flex min-h-screen">
        <div className="w-full h-full">
          <h1 className="font-bold text-blue-500 text-2xl p-8">
            Your Favorites
          </h1>
          <FavoritesGrid />
        </div>
      </div>
    </main>
  );
}
