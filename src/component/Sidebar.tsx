"use client"

import Link from "next/link"
import { useState } from "react"
import type { ReactElement } from "react"

// Icon components for different categories
const ClothingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const FurnitureIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
  </svg>
)

const ElectronicsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const BooksIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const SportsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-7 4 7M3 4h18M4 4h16v6a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
)

const HomeGardenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const BeautyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const ToysIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m4 6h1a3 3 0 000-6h-1m-2 8v2a3 3 0 01-6 0v-2m12 0v2a3 3 0 01-6 0v-2" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// Define the icon type
type IconName = 'clothing' | 'furniture' | 'electronics' | 'books' | 'sports' | 'home-garden' | 'beauty' | 'toys';

// Define the category interface
interface Category {
  key: string;
  label: string;
  href: string;
  icon: IconName;
}

// Categories data
const CATEGORIES: Category[] = [
  {
    key: 'clothing',
    label: 'Clothing',
    href: '/categories/clothing',
    icon: 'clothing'
  },
  {
    key: 'furniture',
    label: 'Furniture',
    href: '/categories/furniture',
    icon: 'furniture'
  },
  {
    key: 'electronics',
    label: 'Electronics',
    href: '/categories/electronics',
    icon: 'electronics'
  },
  {
    key: 'books',
    label: 'Books',
    href: '/categories/books',
    icon: 'books'
  },
  {
    key: 'sports',
    label: 'Sports & Outdoors',
    href: '/categories/sports',
    icon: 'sports'
  },
  {
    key: 'home-garden',
    label: 'Home & Garden',
    href: '/categories/home-garden',
    icon: 'home-garden'
  },
  {
    key: 'beauty',
    label: 'Beauty & Health',
    href: '/categories/beauty',
    icon: 'beauty'
  },
  {
    key: 'toys',
    label: 'Toys & Games',
    href: '/categories/toys',
    icon: 'toys'
  }
]

// Type the getIcon function properly
const getIcon = (iconName: IconName): ReactElement | null => {
  const icons: Record<IconName, ReactElement> = {
    clothing: <ClothingIcon />,
    furniture: <FurnitureIcon />,
    electronics: <ElectronicsIcon />,
    books: <BooksIcon />,
    sports: <SportsIcon />,
    'home-garden': <HomeGardenIcon />,
    beauty: <BeautyIcon />,
    toys: <ToysIcon />
  }
  return icons[iconName] || null
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  return (
    <div className={`bg-[#FFFBDE] border-r border-gray-200 shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex-shrink-0`}>
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-gray-800">
              Categories
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      {/* Categories Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 group ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getIcon(category.icon)}
              </div>
              
              {!isCollapsed && (
                <span className="flex-1">{category.label}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {category.label}
                </div>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar