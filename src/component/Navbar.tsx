"use client"

import Image from "next/image"
import Link from "next/link"
import { NAV_LINKS } from "../../constants"
import { useState } from "react"
import { useSearchContext } from "../contexts/SearchContext"

// Icon components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

// Sample notifications data
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

const ProfileDropdown = () => {
  return (
    <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="py-1">
        <Link
          href="/profile"
          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <UserIcon />
          <span>Profile</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <SettingsIcon />
          <span>Settings</span>
        </Link>
        <hr className="my-1 border-gray-200" />
        <Link
          href="/login"
          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <LogoutIcon />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}

const Navbar = () => {
  const { setSearchQuery } = useSearchContext()
  const [localSearchValue, setLocalSearchValue] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notificationTimeout, setNotificationTimeout] = useState(null)
  const [profileTimeout, setProfileTimeout] = useState(null)

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
    }, 150)
    setNotificationTimeout(timeout)
  }

  const handleProfileHover = () => {
    if (profileTimeout) {
      clearTimeout(profileTimeout)
      setProfileTimeout(null)
    }
    setShowProfile(true)
  }

  const handleProfileLeave = () => {
    const timeout = setTimeout(() => {
      setShowProfile(false)
    }, 150)
    setProfileTimeout(timeout)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(localSearchValue)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Main Navbar */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0 flex items-center">
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
          <div className="flex-1 max-w-2xl mx-4 hidden md:block text-black">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex border border-2 border-black rounded-full overflow-hidden">
                <input
                  type="text"
                  placeholder="Search"
                  value={localSearchValue}
                  onChange={(e) => setLocalSearchValue(e.target.value)}
                  className="flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors duration-200"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.filter(link => link.key !== 'cart').map((link) => {
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
                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-1"
                      >
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

              // Special handling for profile
              if (link.key === 'profile') {
                return (
                  <div 
                    key={link.key}
                    className="relative"
                  >
                    <div
                      onMouseEnter={handleProfileHover}
                      onMouseLeave={handleProfileLeave}
                    >
                      <button
                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-1"
                      >
                        <span className={link.type === 'icon' ? 'hidden xl:inline' : ''}>
                          {link.label}
                        </span>
                      </button>
                      
                      {/* Profile Dropdown */}
                      {showProfile && <ProfileDropdown />}
                    </div>
                  </div>
                )
              }

              // Regular links - Make Sell button blue
              return (
                <Link 
                  key={link.key} 
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    link.key === 'sell' || link.type === 'button'
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  } flex items-center space-x-1`}
                >
                  <span className={link.type === 'icon' ? 'hidden xl:inline' : ''}>
                    {link.label}
                  </span>
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