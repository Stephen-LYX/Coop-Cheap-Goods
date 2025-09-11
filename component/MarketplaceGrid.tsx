"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Sample data - replace this with your actual data source
const SAMPLE_ITEMS = [
  {
    id: 1,
    name: "Vintage Camera Canon AE-1",
    price: 299.99,
    image: "/api/placeholder/300/300",
    location: "New York, NY",
    shipping: "Free shipping",
    condition: "Used - Excellent"
  },
  {
    id: 2,
    name: "MacBook Pro 13-inch M2 2022",
    price: 1299.00,
    image: "/api/placeholder/300/300",
    location: "San Francisco, CA",
    shipping: "$15.99 shipping",
    condition: "Used - Very Good"
  },
  {
    id: 3,
    name: "Nike Air Jordan 1 Retro High",
    price: 180.50,
    image: "/api/placeholder/300/300",
    location: "Chicago, IL",
    shipping: "Free shipping",
    condition: "New with box"
  },
  {
    id: 4,
    name: "Wooden Coffee Table Handmade",
    price: 450.00,
    image: "/api/placeholder/300/300",
    location: "Austin, TX",
    shipping: "Local pickup only",
    condition: "New"
  },
  {
    id: 5,
    name: "iPhone 14 Pro Max 256GB",
    price: 899.99,
    image: "/api/placeholder/300/300",
    location: "Los Angeles, CA",
    shipping: "Free shipping",
    condition: "Used - Good"
  },
  {
    id: 6,
    name: "Acoustic Guitar Yamaha FG830",
    price: 199.99,
    image: "/api/placeholder/300/300",
    location: "Nashville, TN",
    shipping: "$25.00 shipping",
    condition: "Used - Very Good"
  },
  {
    id: 7,
    name: "Gaming Chair RGB LED",
    price: 249.99,
    image: "/api/placeholder/300/300",
    location: "Seattle, WA",
    shipping: "Free shipping",
    condition: "New"
  },
  {
    id: 8,
    name: "Vintage Vinyl Record Collection",
    price: 75.00,
    image: "/api/placeholder/300/300",
    location: "Detroit, MI",
    shipping: "$12.99 shipping",
    condition: "Used - Good"
  },
  {
    id: 9,
    name: "Mountain Bike Trek X-Caliber",
    price: 650.00,
    image: "/api/placeholder/300/300",
    location: "Denver, CO",
    shipping: "Local pickup only",
    condition: "Used - Excellent"
  },
  {
    id: 10,
    name: "KitchenAid Stand Mixer",
    price: 199.95,
    image: "/api/placeholder/300/300",
    location: "Boston, MA",
    shipping: "Free shipping",
    condition: "Used - Very Good"
  },
  {
    id: 11,
    name: "PlayStation 5 Console",
    price: 499.99,
    image: "/api/placeholder/300/300",
    location: "Miami, FL",
    shipping: "$19.99 shipping",
    condition: "New in box"
  },
  {
    id: 12,
    name: "Designer Handbag Coach",
    price: 125.00,
    image: "/api/placeholder/300/300",
    location: "Atlanta, GA",
    shipping: "Free shipping",
    condition: "Used - Good"
  }
]

const HeartIcon = ({ filled = false }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const ItemCard = ({ item }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
      <Link href={`/item/${item.id}`} className="block">
        <div className="relative">
          {/* Item Image */}
          <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <HeartIcon filled={isWishlisted} />
          </button>
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
          <ItemCard key={item.id} item={item} />
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