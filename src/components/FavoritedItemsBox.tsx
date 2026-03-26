'use client'

import { useItemContext } from "../contexts/ItemContext"
import CompactItemCard from "./CompactItemCard"
import Link from "next/link"
import { Item } from "./ItemCard"

export default function FavoritedItemsBox() {
  const { favorites } = useItemContext()

  // Show only the 4 most recent favorites for 2x2 grid
  const displayedFavorites = favorites.slice(0, 4)

  return (
    <div className="bg-white rounded-lg shadow p-3 flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Favorited Items</h2>
        {displayedFavorites.length > 0 && (
          <Link
            href="/favorites"
            className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
          >
            View all
          </Link>
        )}
      </div>
      {displayedFavorites.length === 0 ? (
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No Favorite Items Yet</h3>
          <p className="text-gray-500 text-xs">
            Click the heart icon on any item to save it.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {displayedFavorites.map((item) => (
            <CompactItemCard key={item.id} item={item as Item} />
          ))}
        </div>
      )}
    </div>
  )
}
