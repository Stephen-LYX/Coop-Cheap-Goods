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

    useEffect(() => {
        const storedFavs = localStorage.getItem("itemFavorites")
        
        if (storedFavs) {
            try {
                setFavorites(JSON.parse(storedFavs))
            } catch (error) {
                console.error('Failed to parse favorites from localStorage:', error)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('itemFavorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (item: Item) => {
        setFavorites(prev => [...prev, item])
    }

    const removeFromFavorites = (itemId: string | number) => {
        setFavorites(prev => prev.filter(item => item.id !== itemId))
    }
    
    const isFavorite = (itemId: string | number) => {
        return favorites.some(item => item.id === itemId)
    }

    const value: ItemContextType = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    )
}