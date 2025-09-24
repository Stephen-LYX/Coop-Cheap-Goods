"use client"

import { useState } from "react"
import ItemCard from "./ItemCard" // Import your ItemCard component
import { SAMPLE_ITEMS } from "../../constants" // Import sample items

const MarketplaceGrid = () => {
  const [sortBy, setSortBy] = useState('newest')

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Items</h1>
          <p className="text-gray-600 mt-1">{SAMPLE_ITEMS.length} items available</p>
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
          <option value="distance">Distance</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {SAMPLE_ITEMS.map((item) => (
          <ItemCard
            key={item.id}
            item={{
              id: String(item.id),                 // convert number → string
              title: item.name,                    // map "name" → "title"
              description: item.condition || "No description provided", 
              price: item.price,
              image_url: item.image,               // map "image" → "image_url"
              seller_id: "sample-seller-id",       // mock field
              seller: {                            // mock seller object
                username: item.location || "Seller",
                full_name: "Demo User",
                avatar_url: "/default-avatar.png",
              },
              created_at: new Date().toISOString(), // mock date
            }}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
          Load More Items
        </button>
      </div>
    </div>
  )
}

export default MarketplaceGrid
