import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../component/Footer";
import Providers from "../providers/Providers";
import LayoutClient from "./layout-client";

import { AuthProvider } from "../contexts/AuthContext";
import { SearchProvider } from "../contexts/SearchContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coop",
  description: "Marketplace for local communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/flowbite@4.0.1/dist/flowbite.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Providers>
            <SearchProvider>
              <LayoutClient>{children}</LayoutClient>
            </SearchProvider>
          </Providers>
        </AuthProvider>
        <Script src="https://cdn.jsdelivr.net/npm/flowbite@4.0.1/dist/flowbite.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
