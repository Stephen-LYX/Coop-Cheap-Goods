import {createContext, useState, useContext, useEffect} from "react"

const ItemContext = createContext()

export const useItemContext = () => useContext(ItemContext)

export const ItemProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        const storedFavs = localStorage.getItem("itemFavorites")

        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('itemFavorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (item) => {
        setFavorites(prev => [...prev, item])
    }

    const removeFromFavorites = (itemId) => {
        setFavorites(prev => prev.filter(item => item.id !== itemId))
    }
    
    const isFavorite = (itemId) => {
        return favorites.some(item => item.id === itemId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <ItemContext.Provider value={value}>
        {children}
    </ItemContext.Provider>
}