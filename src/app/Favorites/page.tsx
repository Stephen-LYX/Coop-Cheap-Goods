'use client'
import FavoritesGrid from "../../component/FavoriteGrid";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
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
    <main className="">
      <Navbar />
        <div className="flex min-h-screen">
          <Sidebar />
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