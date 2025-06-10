import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function useFavorites() {
    return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (book) => {
        setFavorites(prev => {
            if (!prev.some(b => b.book_id === book.book_id)) {
                return [...prev, book];
            }
            return prev;
        });
    };

    const removeFavorite = (bookId) => {
        setFavorites(prev => prev.filter(book => book.book_id !== bookId));
    };

    const isFavorite = (bookId) => {
        return favorites.some(book => book.book_id === bookId);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
} 