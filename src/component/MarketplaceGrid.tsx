"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import ItemCard from "./ItemCard"
import { useSearchContext } from "../contexts/SearchContext"
import { createClient } from "@/utils/supabase/client"
import { getImageUrl } from "@/utils/imageUtils"

interface MarketplaceGridProps {
  category?: string
}

// Define the Item interface to match your Supabase table structure
interface Item {
  id: number
  title: string
  description: string | null
  price: number
  condition: string
  category: string
  image_path: string | null
  image_url: string | null
  created_at?: string
  user_id?: string
}

const MarketplaceGrid = ({ category }: MarketplaceGridProps) => {
  const { searchQuery } = useSearchContext()
  const [items, setItems] = useState<Item[]>([])
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Fetch items from Supabase
  const fetchItems = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("items")
        .select("*")

      // Filter by category if provided
      if (category) {
        query = query.eq('category', category)
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true })
          break
        case 'price-high':
          query = query.order('price', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('id', { ascending: false })
          break
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching items:", error)
        setItems([])
      } else {
        setItems(data ?? [])
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  // Load items on mount and when sort or category changes
  useEffect(() => {
    fetchItems()
  }, [sortBy, category])

  // Filter items based on search query (client-side filtering)
  const filteredItems = items.filter(item => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase().trim()
    return (
      item.title?.toLowerCase().includes(query) ||
      item.condition?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="px-6 py-4 max-w-7xl mx-auto">
      {/* Header with results count and sort */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {searchQuery.trim() && (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredItems.length} items found
              </p>
            </>
          )}
        </div>
        
        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-black px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          {filteredItems.length === 0 && searchQuery.trim() && (
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

          {/* No Items in Database */}
          {filteredItems.length === 0 && !searchQuery.trim() && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 mb-4">
                  {category 
                    ? `There are currently no items in the ${category} category.`
                    : "There are currently no items."
                  }
                </p>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {filteredItems.length > 0 && (
            <>
              <div className="w-full px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredItems.map((item) => (
                    <ItemCard 
                      key={item.id} 
                      item={{
                        id: item.id,
                        name: item.title,
                        // Convert storage path to full URL
                        image: item.image_path ? getImageUrl(item.image_path) : (item.image_url || '/placeholder.png'),
                        condition: item.condition,
                        price: item.price
                      }} 
                    />
                  ))}
                </div>
              </div>

              {/* Load More Button - Only show if we're displaying all items (no search) */}
              {!searchQuery.trim() && (
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={fetchItems}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
                  >
                    Refresh Items
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