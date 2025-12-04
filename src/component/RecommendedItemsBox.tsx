'use client'

import { useState, useEffect } from "react"
import CompactItemCard from "./CompactItemCard"
import { createClient } from "@/utils/supabase/client"
import { Item } from "./ItemCard"

interface DbItem {
  id: number
  title: string
  description: string | null
  price: number
  condition: string
  category: string
  image_path: string | null
  image_url: string | null
  user_id?: string
}

export default function RecommendedItemsBox() {
  const [recommendedItems, setRecommendedItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchRecommendedItems()
  }, [])

  const fetchRecommendedItems = async () => {
    setLoading(true)
    try {
      // Fetch random items from the database
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order('id', { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching recommended items:", error)
        setRecommendedItems([])
      } else if (data) {
        // Shuffle and take 4 items
        const shuffled = data.sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, 4)

        // Transform to Item format
        const items: Item[] = selected.map((item: DbItem) => ({
          id: item.id,
          name: item.title,
          image: item.image_url || '',
          condition: item.condition,
          price: item.price,
          user_id: item.user_id,
          category: item.category
        }))

        setRecommendedItems(items)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setRecommendedItems([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-3">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Recommended for You</h2>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  if (recommendedItems.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {recommendedItems.map((item) => (
          <CompactItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
