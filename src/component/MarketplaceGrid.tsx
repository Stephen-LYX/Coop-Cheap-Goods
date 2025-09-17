"use client"

import { useState, useEffect } from "react"
import ItemCard from "./ItemCard"
import { SAMPLE_ITEMS } from "../../constants"
import { useSearchContext } from "../contexts/SearchContext"

const MarketplaceGrid = () => {
  const { searchQuery } = useSearchContext() // Get search query from navbar
  const [items, setItems] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(false)

  // Load all items on component mount
  useEffect(() => {
    setItems(SAMPLE_ITEMS)
  }, [])

  // Filter and sort items whenever searchQuery or sortBy changes
  useEffect(() => {
    const filterAndSortItems = () => {
      setLoading(true)
      
      // Start with all items
      let filteredItems = SAMPLE_ITEMS

      // Filter items based on search query from navbar
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        filteredItems = SAMPLE_ITEMS.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.condition.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query))
        )
      }

      // Sort the filtered items
      const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'newest':
          default:
            return b.id - a.id
        }
      })

      setItems(sortedItems)
      setLoading(false)
    }

    filterAndSortItems()
  }, [searchQuery, sortBy]) // Re-run when search query or sort changes

  return (
    <div className="p-6">
      {/* Header with results count and sort */}
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

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      ) : (
        <>
          {/* No Results Message */}
          {items.length === 0 && searchQuery.trim() && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any items matching "{searchQuery}". Try different search terms.
                </p>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {items.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Load More Button - Only show if we're displaying all items (no search) */}
              {!searchQuery.trim() && (
                <div className="flex justify-center mt-8">
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
                    Load More Items
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