import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useItemContext } from "../contexts/ItemContext"
import { useAuth } from "../contexts/AuthContext"
import { Item } from "./ItemCard"

interface CompactItemCardProperty {
  item: Item
}

function CompactItemCard({ item }: CompactItemCardProperty) {
  const { isFavorite, addToFavorites, removeFromFavorites, addToRecentlyViewed } = useItemContext()
  const { user } = useAuth()
  const favorite = isFavorite(item.id)
  const [imageError, setImageError] = useState(false)
  const isOwnItem = user && item.user_id && user.id === item.user_id

  // Convert category name to URL format
  const getCategoryPath = (category: string | undefined) => {
    if (!category) return 'other'

    const categoryMap: { [key: string]: string } = {
      'Electronics': 'electronics',
      'Clothing': 'clothing',
      'Books': 'books',
      'Home & Kitchen': 'home-kitchen',
      'Beauty & Health': 'beauty-health',
      'Sports & Outdoors': 'sports-outdoors',
      'Toys & Games': 'toys-games',
      'Other': 'other',
    }

    return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')
  }

  const handleItemClick = () => {
    addToRecentlyViewed(item)
  }

  function onFavoriteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (favorite) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E"

  const getImageSrc = () => {
    if (imageError) return placeholderImage
    if (!item.image) return placeholderImage

    if (item.image.startsWith('/')) return item.image

    return `/uploaded/${item.image}`
  }

  const categoryPath = getCategoryPath(item.category)
  const itemUrl = `/categories/${categoryPath}/${item.id}`

  return (
    <div className={`bg-white rounded-lg hover:shadow-md transition-shadow duration-200 group w-full ${
      isOwnItem ? 'ring-2 ring-blue-500' : ''
    }`}>
      <Link href={itemUrl} onClick={handleItemClick} className="block">
        <div className="relative">
          {isOwnItem && (
            <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
              Yours
            </div>
          )}
          {/* Compact Item Image - Only the image, no title or price */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200 shadow-sm">
            <Image
              src={getImageSrc()}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              onError={() => setImageError(true)}
            />
            {/* Compact Wishlist Button */}
            <div className="absolute inset-0">
              <button
                onClick={onFavoriteClick}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  favorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
              >
                <svg className="w-5 h-5" fill={favorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CompactItemCard
