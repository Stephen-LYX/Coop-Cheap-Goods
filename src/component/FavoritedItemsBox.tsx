'use client'

import { useItemContext } from "../contexts/ItemContext"
import CompactItemCard from "./CompactItemCard"
import Link from "next/link"
import { Item } from "./ItemCard"

export default function FavoritedItemsBox() {
  const { favorites } = useItemContext()

  // Show only the 4 most recent favorites for 2x2 grid
  const displayedFavorites = favorites.slice(0, 4)

  if (displayedFavorites.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Favorited Items</h2>
        <Link
          href="/favorites"
          className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {displayedFavorites.map((item) => (
          <CompactItemCard key={item.id} item={item as Item} />
        ))}
      </div>
    </div>
  )
}
