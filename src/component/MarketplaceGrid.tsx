"use client"

import { useState, useEffect } from "react"
import ItemCard from "./ItemCard"
import { SAMPLE_ITEMS } from "../../constants"

type Item = {
  id: number
  name: string
  description?: string
  category?: string
  price: number
  image?: string
  location?: string
  shipping?: string
  condition?: string
}

const MarketplaceGrid = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const q = searchQuery.trim().toLowerCase()
    let filtered = SAMPLE_ITEMS

    if (q) {
      filtered = SAMPLE_ITEMS.filter(item => {
        const hay = [item.name, item.condition, item.description, item.category, item.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return hay.includes(q)
      })
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price
        case "price-high": return b.price - a.price
        default: return b.id - a.id
      }
    })

    setItems(sorted)
    setLoading(false)
  }, [searchQuery, sortBy])

  // NOTE: This version uses a placeholder for searchQuery. 
  // You would replace it with your actual search context logic.

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Browse Items'}
          </h1>
          <p className="text-gray-600 mt-1">
            {items.length} items {searchQuery.trim() ? 'found' : 'available'}
          </p>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="newest">Newest first</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Loading or No Results Message */}
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No items found.</p>
      )}

      {/* Correct Items Grid */}
      {items.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                // NOTE: This mapping assumes ItemCard expects a different structure.
                // If ItemCard can accept the SAMPLE_ITEMS structure directly, this mapping is not needed.
                item={{
                  id: String(item.id),
                  title: item.name,
                  description: item.condition || "No description provided",
                  price: item.price,
                  image_url: item.image,
                  seller_id: "sample-seller-id",
                  seller: {
                    username: item.location || "Seller",
                    full_name: "Demo User",
                    avatar_url: "/default-avatar.png",
                  },
                  created_at: new Date().toISOString(),
                }}
              />
            ))}
          </div>

          {/* Load More Button */}
          {!searchQuery.trim() && (
            <div className="flex justify-center mt-8">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
                Load More Items
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MarketplaceGrid