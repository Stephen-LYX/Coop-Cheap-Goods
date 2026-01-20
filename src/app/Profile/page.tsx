"use client"

import { useState, useEffect } from 'react'
import Navbar from '@/component/Navbar'
import CategoryBar from '@/component/CategoryBar'
import ItemCard from '@/component/ItemCard'
import { Item } from '@/component/ItemCard'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'

// Custom SVG Icon Components
const Edit3 = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const Mail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const Calendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const Package = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const Save = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
)

const X = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

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
  created_at?: string
}

const ProfilePage = () => {
  const { user } = useAuth()
  const supabase = createClient()
  const [isEditing, setIsEditing] = useState(false)
  const [userItems, setUserItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.username || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
  })

  const [tempData, setTempData] = useState(profileData)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('') // Temporary input value
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices')

  // Categories list
  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Books',
    'Home & Kitchen',
    'Beauty & Health',
    'Sports & Outdoors',
    'Toys & Games',
    'Other'
  ]

  // Price ranges
  const priceRanges = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: Infinity }
  ]

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
      })
      fetchUserItems()
    }
  }, [user])

  const fetchUserItems = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user items:', error)
        setUserItems([])
      } else if (data) {
        const items: Item[] = data.map((item: DbItem) => ({
          id: item.id,
          name: item.title,
          image: item.image_url || '',
          condition: item.condition,
          price: item.price,
          user_id: item.user_id,
          category: item.category
        }))
        setUserItems(items)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setUserItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setTempData(profileData)
  }

  const handleSave = () => {
    setProfileData(tempData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }))
  }

  // Get user initials for avatar
  const getInitials = () => {
    const name = profileData.name || 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Filter items based on search and filters
  const filteredItems = userItems.filter((item) => {
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory

    // Price range filter
    const priceRange = priceRanges.find(range => range.label === selectedPriceRange)
    const matchesPrice = !priceRange || (item.price >= priceRange.min && item.price <= priceRange.max)

    return matchesSearch && matchesCategory && matchesPrice
  })

  // Handle search on Enter key press
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSearchInput('')
    setSelectedCategory('All Categories')
    setSelectedPriceRange('All Prices')
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedPriceRange !== 'All Prices'

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <CategoryBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                  {getInitials()}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-300 focus:border-blue-600 outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar />
                        <span>Joined {profileData.joinDate}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Save />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                      <X />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Items Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Package />
              <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {userItems.length}
              </span>
            </div>
          </div>

          {/* Search and Filter Section */}
          {userItems.length > 0 && (
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search items"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </form>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center space-x-2">
                  <FilterIcon />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Price Range Filter */}
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}

                {/* Results Count */}
                <span className="text-sm text-gray-600 ml-auto">
                  Showing {filteredItems.length} of {userItems.length} items
                </span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">Loading your items...</div>
            </div>
          ) : userItems.length === 0 ? (
            <div className="text-center py-12">
              <Package />
              <p className="text-gray-600 mt-4 mb-6">You haven&apos;t posted any items yet</p>
              <a
                href="/sell"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Your First Item
              </a>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FilterIcon />
              <p className="text-gray-600 mt-4 mb-6">No items match your filters</p>
              <button
                onClick={clearFilters}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
