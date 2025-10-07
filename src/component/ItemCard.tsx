import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useItemContext } from "../contexts/ItemContext"

const HeartIcon = ({ filled = false }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

export interface Item {
  id: number | string
  name: string
  image: string
  condition: string
  price: number
}

interface ItemCardProperty {
  item: Item
}

function ItemCard({ item }: ItemCardProperty) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useItemContext()
  const favorite = isFavorite(item.id)
  const [imageError, setImageError] = useState(false)

  function onFavoriteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (favorite) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

  // Check if image URL is valid
  const isValidUrl = (urlString: string) => {
    if (!urlString) return false
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const hasValidImage = isValidUrl(item.image) && !imageError
  
  // Placeholder image as data URL (a simple gray square with "No Image" text)
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E"

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
      <Link href={`/item/${item.id}`} className="block">
        <div className="relative">
          {/* Item Image */}
          <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
            <Image
              src={hasValidImage ? item.image : placeholderImage}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
            {/* Wishlist Button Overlay */}
            <div className="absolute inset-0">
              <button
                onClick={onFavoriteClick}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  favorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
              >
                <HeartIcon filled={favorite} />
              </button>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="p-4">
          {/* Item Name */}
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
          
          {/* Condition */}
          <p className="text-xs text-gray-500 mb-2">
            {item.condition}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-900">
              ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ItemCard