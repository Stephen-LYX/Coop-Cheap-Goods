"use client";

import { Vidaloka } from "next/font/google";

const vidaloka = Vidaloka({
  weight: "400",
  subsets: ["latin"],
});

import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../../../constants";
import { useState } from "react";
import { useSearchContext } from "../../contexts/SearchContext";
import CategoryBar from "./CategoryBar";

// Icon components
const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);


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
        {/* <Link
          href="/settings"
          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <SettingsIcon />
          <span>Settings</span>
        </Link> */}
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
  );
};

const Navbar = () => {
  const { setSearchQuery } = useSearchContext();
  const [localSearchValue, setLocalSearchValue] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profileTimeout, setProfileTimeout] = useState<number | null>(null);

  const handleProfileHover = () => {
    if (profileTimeout) {
      clearTimeout(profileTimeout);
      setProfileTimeout(null);
    }
    setShowProfile(true);
  };

  const handleProfileLeave = () => {
    const timeout = setTimeout(() => {
      setShowProfile(false);
    }, 150) as unknown as number;
    setProfileTimeout(timeout);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchValue);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* Main Navbar */}
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="shrink-0 flex items-center">
                <Image
                  src="/chicken.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span
                  className={`text-4xl font-black text-blue-600 hidden sm:block ${vidaloka.className}`}
                >
                  Coop
                </span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-4 hidden md:block text-black">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex border-2 border-black rounded-full overflow-hidden">
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
              {NAV_LINKS.filter((link) => link.key !== "cart" && link.key !== "notifications").map((link) => {
                // Special handling for profile
                if (link.key === "profile") {
                  return (
                    <div key={link.key} className="relative">
                      <div
                        onMouseEnter={handleProfileHover}
                        onMouseLeave={handleProfileLeave}
                      >
                        <button className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-1">
                          <span
                            className={
                              "type" in link && link.type === "icon"
                                ? "hidden xl:inline"
                                : ""
                            }
                          >
                            {link.label}
                          </span>
                        </button>

                        {/* Profile Dropdown */}
                        {showProfile && <ProfileDropdown />}
                      </div>
                    </div>
                  );
                }

                // Regular links - Make Sell button blue
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      link.key === "sell" ||
                      ("type" in link && link.type === "button")
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    } flex items-center space-x-1`}
                  >
                    <span
                      className={
                        "type" in link && link.type === "icon"
                          ? "hidden xl:inline"
                          : ""
                      }
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <CategoryBar />
    </>
  );
};

export default Navbar;
