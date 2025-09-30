"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext(): SearchContextType {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider')
  }
  return context
}