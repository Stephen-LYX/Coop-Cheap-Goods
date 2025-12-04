'use client'

// import { redirect } from "next/navigation";
import CategoryBar from "@/component/CategoryBar";
import MarketplaceGrid from "../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
import RecentlyViewedBox from "@/component/RecentlyViewedBox";
import FavoritedItemsBox from "@/component/FavoritedItemsBox";
import RecommendedItemsBox from "@/component/RecommendedItemsBox";

export default function Home() {
  return (
    <main>
        <Navbar />
        <CategoryBar />

        {/* Recently Viewed, Favorited Items, and Recommended Section */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <RecentlyViewedBox />
            <FavoritedItemsBox />
            <RecommendedItemsBox />
          </div>
        </div>

        <div>
            <MarketplaceGrid />
        </div>
    </main>
  );
}