'use client'

import Navbar from "@/component/Navbar"
import CategoryBar from "@/component/CategoryBar"
import ItemCard from "@/component/ItemCard"
import { useItemContext } from "@/contexts/ItemContext"

export default function RecentlyViewedPage() {
  const { recentlyViewed } = useItemContext()

  return (
    <main>
      <Navbar />
      <CategoryBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Recently Viewed Items</h1>

        {recentlyViewed.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't viewed any items yet.</p>
            <p className="text-gray-400 mt-2">Start browsing to see your recently viewed items here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
