"use client"

import Link from "next/link"
import React from "react"

// Icon components for different categories
const ClothingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

const OutdoorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10c-2-4 1-7 5-7-1 4-2 7-5 7zm0 0c2-4-1-7-5-7 1 4 2 7 5 7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14h10l-1 7H8l-1-7z" />
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MusicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
)

const OtherIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
)

type IconName = 'clothing' | 'electronics' | 'books' | 'outdoor' | 'home-kitchen' | 'beauty' | 'toys' | 'music' | 'other';

interface Category {
  key: string;
  label: string;
  href: string;
  icon: IconName;
}

export const CATEGORIES: Category[] = [
  {
    key: 'clothing',
    label: 'Clothing',
    href: '/categories/clothing',
    icon: 'clothing'
  },
  {
    key: 'electronics',
    label: 'Electronics',
    href: '/categories/electronics',
    icon: 'electronics'
  },
  {
    key: 'outdoors',
    label: 'Garden & Outdoors',
    href: '/categories/garden-and-outdoor',
    icon: 'outdoor'
  },
  {
    key: 'home-kitchen',
    label: 'Home & Kitchen',
    href: '/categories/home-and-kitchen',
    icon: 'home-kitchen'
  },
  {
    key: 'books',
    label: 'Books',
    href: '/categories/books',
    icon: 'books'
  },
  {
    key: 'beauty',
    label: 'Beauty & Health',
    href: '/categories/beauty-health',
    icon: 'beauty'
  },
  {
    key: 'toys',
    label: 'Toys & Games',
    href: '/categories/toys-games',
    icon: 'toys'
  },
  {
    key: 'music',
    label: 'Musical Instruments',
    href: '/categories/musical-instruments',
    icon: 'music'
  },
  {
    key: 'other',
    label: 'Other',
    href: '/categories/other',
    icon: 'other'
  }
]

const getIcon = (iconName: IconName) => {
  const icons: Record<IconName, React.ReactElement> = {
    clothing: <ClothingIcon />,
    electronics: <ElectronicsIcon />,
    books: <BooksIcon />,
    outdoor: <OutdoorIcon />,
    'home-kitchen': <HomeGardenIcon />,
    beauty: <BeautyIcon />,
    toys: <ToysIcon />,
    music: <MusicIcon />,
    other: <OtherIcon />
  }
  return icons[iconName] || null
}

const CategoryBar = () => {
  return (
    <div className="bg-[#ffffff] border-gray-200 sticky top-16 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-center overflow-x-auto py-1">
          <div className="flex space-x-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 whitespace-nowrap"
              >
                <div className="flex-shrink-0">
                  {getIcon(category.icon)}
                </div>
                <span>{category.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default CategoryBar