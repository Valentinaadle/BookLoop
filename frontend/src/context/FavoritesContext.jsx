import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getBookImage } from '../utils/bookUtils';

const FavoritesContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function useFavorites() {
    return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();

    // Cargar favoritos desde la base de datos
    const fetchFavorites = async () => {
        if (user) {
            try {
                const response = await fetch(`${API_URL}/api/wishlist?userId=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    const userFavorites = data.map(item => ({
                        ...item.Book,
                        autor: item.Book.authors,
                        img: getBookImage(item.Book, API_URL)
                    }));
                    setFavorites(userFavorites);
                } else {
                    console.error('Error al cargar favoritos:', await response.text());
                }
            } catch (error) {
                console.error('Error al cargar favoritos:', error);
            }
        } else {
            setFavorites([]);
        }
    };

    // Cargar favoritos cuando el usuario inicia sesión
    useEffect(() => {
        fetchFavorites();
    }, [user]);

    const addFavorite = async (book) => {
        if (!user) return;
        
        try {
            const response = await fetch(`${API_URL}/api/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    bookId: book.book_id,
                    userId: user.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                setFavorites(prev => {
                    if (!prev.some(b => b.book_id === book.book_id)) {
                        return [...prev, {
                            ...book,
                            autor: book.authors || book.autor,
                            img: getBookImage(book, API_URL)
                        }];
                    }
                    return prev;
                });
                return true;
            } else {
                console.error('Error al agregar favorito:', await response.text());
                return false;
            }
        } catch (error) {
            console.error('Error al agregar favorito:', error);
            return false;
        }
    };

    const removeFavorite = async (bookId) => {
        if (!user) return false;

        try {
            const response = await fetch(`${API_URL}/api/wishlist/${bookId}?userId=${user.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setFavorites(prev => prev.filter(book => book.book_id !== bookId));
                return true;
            } else {
                console.error('Error al eliminar favorito:', await response.text());
                return false;
            }
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
            return false;
        }
    };

    const isFavorite = async (bookId) => {
        if (!user) return false;

        try {
            const response = await fetch(`${API_URL}/api/wishlist/check/${bookId}?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                return data.isFavorite;
            }
            console.error('Error al verificar favorito:', await response.text());
            return false;
        } catch (error) {
            console.error('Error al verificar favorito:', error);
            return false;
        }
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite,
            refreshFavorites: fetchFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
}