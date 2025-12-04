import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Footer from "../component/Footer"
import Providers from "../providers/Providers"
import LayoutClient from "./layout-client"

import { AuthProvider } from "../contexts/AuthContext"
import { SearchProvider } from "../contexts/SearchContext"

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
        <AuthProvider>
          <Providers>
            <SearchProvider>
              <LayoutClient>{children}</LayoutClient>
            </SearchProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}