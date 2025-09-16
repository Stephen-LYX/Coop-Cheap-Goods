"use client"

import ItemCard, { Item } from "./ItemCard"
import { useItemContext } from "../contexts/ItemContext"


// // Define the Item type - adjust properties based on your actual item structure
// interface Item {
//   id: string | number;
//   // Add other properties that your items have, for example:
//   // title: string;
//   // price: number;
//   // image: string;
//   // description: string;
//   // Add any other properties your items contain
// }

const FavoritesGrid = () => {
  const { favorites } = useItemContext()

  // Empty state when no favorites
  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6">
          <svg 
            className="w-16 h-16 text-gray-400 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Favorite Items Yet</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Start adding items to your favorites and they will appear here. 
          Click the heart icon on any item to save it.
        </p>
        
        <a 
          href="/Home" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          Browse Items
        </a>
      </div>
    )
  }

  return (
    <div className="pt-6">
      {/* Header - similar to MarketplaceGrid */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">{favorites.length} favorite {favorites.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      {/* Items Grid - same as MarketplaceGrid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {favorites.map((item: Item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default FavoritesGrid