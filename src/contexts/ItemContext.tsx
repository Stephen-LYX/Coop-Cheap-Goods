import { createContext, useState, useContext, useEffect, ReactNode } from "react"

// Define the Item type
interface Item {
    id: string | number
    // Add other properties your items have
    name?: string
    // ... other properties
}

// Define the context value type
interface ItemContextType {
    favorites: Item[]
    addToFavorites: (item: Item) => void
    removeFromFavorites: (itemId: string | number) => void
    isFavorite: (itemId: string | number) => boolean
    recentlyViewed: Item[]
    addToRecentlyViewed: (item: Item) => void
}

// Create context with undefined as default (we'll check for this)
const ItemContext = createContext<ItemContextType | undefined>(undefined)

export const useItemContext = (): ItemContextType => {
    const context = useContext(ItemContext)
    if (context === undefined) {
        throw new Error('useItemContext must be used within an ItemProvider')
    }
    return context
}

interface ItemProviderProps {
    children: ReactNode
}

export const ItemProvider = ({ children }: ItemProviderProps) => {
    const [favorites, setFavorites] = useState<Item[]>([])
    const [recentlyViewed, setRecentlyViewed] = useState<Item[]>([])

    useEffect(() => {
        const storedFavs = localStorage.getItem("itemFavorites")

        if (storedFavs) {
            try {
                setFavorites(JSON.parse(storedFavs))
            } catch (error) {
                console.error('Failed to parse favorites from localStorage:', error)
            }
        }

        const storedRecent = localStorage.getItem("recentlyViewed")

        if (storedRecent) {
            try {
                setRecentlyViewed(JSON.parse(storedRecent))
            } catch (error) {
                console.error('Failed to parse recently viewed from localStorage:', error)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('itemFavorites', JSON.stringify(favorites))
    }, [favorites])

    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed))
    }, [recentlyViewed])

    const addToFavorites = (item: Item) => {
        setFavorites(prev => [...prev, item])
    }

    const removeFromFavorites = (itemId: string | number) => {
        setFavorites(prev => prev.filter(item => item.id !== itemId))
    }

    const isFavorite = (itemId: string | number) => {
        return favorites.some(item => item.id === itemId)
    }

    const addToRecentlyViewed = (item: Item) => {
        setRecentlyViewed(prev => {
            // Remove the item if it already exists
            const filtered = prev.filter(i => i.id !== item.id)
            // Add the item to the beginning
            const updated = [item, ...filtered]
            // Keep only the last 20 items
            return updated.slice(0, 20)
        })
    }

    const value: ItemContextType = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        recentlyViewed,
        addToRecentlyViewed
    }

    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    )
}