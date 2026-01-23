// import { redirect } from "next/navigation";
import MarketplaceGrid from "../../components/MarketplaceGrid";
import RecentlyViewedBox from "@/components/RecentlyViewedBox";
import FavoritedItemsBox from "@/components/FavoritedItemsBox";
import RecommendedItemsBox from "@/components/RecommendedItemsBox";

export default function Home() {
  return (
    <main>
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
