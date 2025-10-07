import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "../component/Navbar"
import Sidebar from "../component/Sidebar"
import Providers from "../providers/Providers"

import { AuthProvider } from "../contexts/AuthContext"
import { SearchProvider } from "../contexts/SearchContext" // ✅ <-- ADD THIS IMPORT

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Coop",
  description: "Marketplace for local communities",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Wrap all content with your context providers */}
        <AuthProvider>
          <Providers>
            <SearchProvider> {/* ✅ Add SearchProvider here */}

              {/* Optional Navbar/Sidebar if needed globally */}
              {/* <Navbar /> */}

              <div className="flex min-h-screen">
                {/* <Sidebar /> */}
                <div className="flex-1 flex flex-col">
                  <main className="relative overflow-hidden">
                    {children}
                  </main>
                </div>
              </div>

            </SearchProvider> {/* ✅ Close SearchProvider */}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}