import Link from "next/link"
import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/chicken.png"
                alt="Coop logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-2xl font-black text-white">Coop</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted marketplace for local communities. Buy and sell with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-sm hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/Sell" className="text-sm hover:text-white transition-colors duration-200">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-sm hover:text-white transition-colors duration-200">
                  Favorites
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="text-sm hover:text-white transition-colors duration-200">
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/electronics" className="text-sm hover:text-white transition-colors duration-200">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/categories/clothing" className="text-sm hover:text-white transition-colors duration-200">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/categories/books" className="text-sm hover:text-white transition-colors duration-200">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/categories/home-kitchen" className="text-sm hover:text-white transition-colors duration-200">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/categories/beauty-health" className="text-sm hover:text-white transition-colors duration-200">
                  Beauty & Health
                </Link>
              </li>
              <li>
                <Link href="/categories/sports-outdoors" className="text-sm hover:text-white transition-colors duration-200">
                  Sports & Outdoors
                </Link>
              </li>
              <li>
                <Link href="/categories/toys-games" className="text-sm hover:text-white transition-colors duration-200">
                  Toys & Games
                </Link>
              </li>
              <li>
                <Link href="/categories/other" className="text-sm hover:text-white transition-colors duration-200">
                  Other
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Coop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
