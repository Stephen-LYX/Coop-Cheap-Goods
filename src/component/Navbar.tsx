"use client"

import Image from "next/image"
import Link from "next/link"
import { NAV_LINKS } from "../../constants"
import { useState } from "react"

// Icon components (you can replace these with your preferred icon library)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5h5M6 17h5v-5H6v5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 006 17h12M9 19a2 2 0 11-4 0 2 2 0 014 0zM20 19a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

// Sample notifications data - replace with your actual data
const sampleNotifications = [
  {
    id: 1,
    title: "New message from John",
    message: "Hey! Just wanted to check in...",
    time: "2 min ago",
    unread: true,
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    title: "Order shipped",
    message: "Your order #12345 has been shipped",
    time: "1 hour ago",
    unread: true,
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 3,
    title: "Weekly report ready",
    message: "Your analytics report is ready to view",
    time: "3 hours ago",
    unread: false,
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 4,
    title: "System update",
    message: "New features have been added",
    time: "1 day ago",
    unread: false,
    avatar: "/api/placeholder/32/32"
  }
]

const NotificationsDropdown = ({ notifications }) => {
  return (
    <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <BellIcon />
            <p className="mt-2">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                notification.unread ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <BellIcon />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium text-gray-900 truncate ${
                      notification.unread ? 'font-semibold' : ''
                    }`}>
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <Link
            href="/notifications"
            className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}

const getIcon = (iconName) => {
  const icons = {
    heart: <HeartIcon />,
    mail: <MailIcon />,
    bell: <BellIcon />,
    user: <UserIcon />,
    'shopping-cart': <ShoppingCartIcon />
  }
  return icons[iconName] || null
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationTimeout, setNotificationTimeout] = useState(null)

  const handleNotificationHover = () => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
      setNotificationTimeout(null)
    }
    setShowNotifications(true)
  }

  const handleNotificationLeave = () => {
    const timeout = setTimeout(() => {
      setShowNotifications(false)
    }, 150) // Small delay to allow mouse movement to dropdown
    setNotificationTimeout(timeout)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Main Navbar */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/Home" className="flex-shrink-0 flex items-center">
              <Image 
                src="/chicken.png" 
                alt="logo" 
                width={40} 
                height={40} 
                className="mr-2"
              />
              <span className="text-2xl font-bold text-blue-600 hidden sm:block">
                Coop
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-0 top-0 bottom-0 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-r-full transition-colors duration-200">
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              // Special handling for notifications
              if (link.key === 'notifications') {
                return (
                  <div 
                    key={link.key}
                    className="relative"
                  >
                    <div
                      onMouseEnter={handleNotificationHover}
                      onMouseLeave={handleNotificationLeave}
                    >
                      <Link 
                        href={link.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          link.type === 'button' 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } flex items-center space-x-1`}
                      >
                        {link.icon && getIcon(link.icon)}
                        <span className={link.type === 'icon' ? 'hidden xl:inline' : ''}>
                          {link.label}
                        </span>
                        <span className="bg-red-500 text-white text-xs rounded-full h-2 w-2 ml-1"></span>
                      </Link>
                      
                      {/* Notifications Dropdown */}
                      {showNotifications && (
                        <NotificationsDropdown notifications={sampleNotifications} />
                      )}
                    </div>
                  </div>
                )
              }

              // Regular links
              return (
                <Link 
                  key={link.key} 
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    link.type === 'button' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  } flex items-center space-x-1`}
                >
                  {link.icon && getIcon(link.icon)}
                  <span className={link.type === 'icon' ? 'hidden xl:inline' : ''}>
                    {link.label}
                  </span>
                  {link.key === 'cart' && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                      3
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 