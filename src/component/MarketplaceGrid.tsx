"use client"

import { useState, useEffect } from "react"
import ItemCard, { type MarketplaceItem } from "./ItemCard"
import { useSearchContext } from "../contexts/SearchContext"
import { createClient } from "@/utils/supabase/client"

const MarketplaceGrid = () => {
  const { searchQuery } = useSearchContext()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch items from Supabase
  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const trimmedQuery = searchQuery.trim()

      // Base query
      let query = supabase.from("items").select("*")

      // Apply search filter if there's a search query
      if (trimmedQuery) {
        const searchTerm = `%${trimmedQuery}%`
        query = query.or(
          `title.ilike."${searchTerm}",description.ilike."${searchTerm}",category.ilike."${searchTerm}",condition.ilike."${searchTerm}"`
        )
      }

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          query = query.order("price", { ascending: true })
          break
        case "price-high":
          query = query.order("price", { ascending: false })
          break
        case "newest":
        default:
          query = query.order("created_at", { ascending: false })
          break
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setItems(data || [])
    } catch (err) {
      console.error("Error fetching items:", err)
      setError("Failed to load items. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch items when component mounts or when search/sort changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(fetchItems, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, sortBy])

  return (
    <div className="p-6">
      {/* Header with results count and sort */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : "Browse Items"}
          </h1>
          <p className="text-gray-600 mt-1">
            {items.length} items {searchQuery.trim() ? "found" : "available"}
          </p>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "price-low" | "price-high")}
          className="text-black px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="newest">Newest first</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Items</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchItems}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      ) : (
        <>
          {/* No Results Message */}
          {items.length === 0 && searchQuery.trim() && !error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any items matching "{searchQuery}". Try different search terms.
                </p>
              </div>
            </div>
          )}

          {/* Empty State - No items at all */}
          {items.length === 0 && !searchQuery.trim() && !error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
                <p className="text-gray-600 mb-4">
                  There are currently no items listed in the marketplace.
                </p>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {items.length > 0 && !error && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Load More Button (future pagination) */}
              {!searchQuery.trim() && (
                <div className="flex justify-center mt-8">
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-300 text-white font-medium rounded-md cursor-not-allowed"
                  >
                    Load More (coming soon)
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default MarketplaceGrid
