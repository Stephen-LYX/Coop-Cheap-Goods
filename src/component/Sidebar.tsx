"use client"

import Link from "next/link"
import { useState } from "react"
import type { ReactElement } from "react"

// Icon components matching your navbar style
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const ProductsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const CategoriesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
)

const OrdersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
type IconName = 'home' | 'products' | 'categories' | 'orders' | 'analytics' | 'settings';

// Define the sidebar link interface
interface SidebarLink {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
}

// Sidebar navigation links
const SIDEBAR_LINKS: SidebarLink[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'home'
  },
  {
    key: 'products',
    label: 'Products',
    href: '/products',
    icon: 'products'
  },
  {
    key: 'categories',
    label: 'Categories',
    href: '/categories',
    icon: 'categories'
  },
  {
    key: 'orders',
    label: 'Orders',
    href: '/orders',
    icon: 'orders',
    badge: '12'
  },
  {
    key: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: 'analytics'
  },
  {
    key: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'settings'
  }
]

// Type the getIcon function properly
const getIcon = (iconName: IconName): ReactElement | null => {
  const icons: Record<IconName, ReactElement> = {
    home: <HomeIcon />,
    products: <ProductsIcon />,
    categories: <CategoriesIcon />,
    orders: <OrdersIcon />,
    analytics: <AnalyticsIcon />,
    settings: <SettingsIcon />
  }
  return icons[iconName] || null
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  return (
    <div className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex-shrink-0`}>
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-gray-800">
              Menu
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

      {/* Sidebar Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 group ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getIcon(link.icon)}
              </div>
              
              {!isCollapsed && (
                <>
                  <span className="flex-1">{link.label}</span>
                  {link.badge && (
                    <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {link.label}
                  {link.badge && (
                    <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1">
                      {link.badge}
                    </span>
                  )}
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