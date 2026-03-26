'use client'

import { useItemContext } from "../contexts/ItemContext"
import CompactItemCard from "./CompactItemCard"
import Link from "next/link"
import { Item } from "./ItemCard"

export default function RecentlyViewedBox() {
  const { recentlyViewed } = useItemContext()

  // Show only the 4 most recent items for 2x2 grid
  const displayedItems = recentlyViewed.slice(0, 4)

  return (
    <div className="bg-white rounded-lg shadow p-3 flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recently Viewed</h2>
        {displayedItems.length > 0 && (
          <Link
            href="/recently-viewed"
            className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
          >
            View all
          </Link>
        )}
      </div>
      {displayedItems.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center py-6 text-center">
          <svg
            className="w-10 h-10 text-gray-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No Recently Viewed Items</h3>
          <p className="text-gray-500 text-xs">
            Browse items to see your recently viewed history here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {displayedItems.map((item) => (
            <CompactItemCard key={item.id} item={item as Item} />
          ))}
        </div>
      )}
    </div>
  )
}
