const fetch = require('node-fetch');
const Book = require('../models/Book');

const searchBooks = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Se requiere un término de búsqueda' });
        }

        console.log('Buscando:', q);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&langRestrict=es`;
        console.log('URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Books API respondió con status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resultados encontrados:', data.totalItems);
        console.log('Primer libro:', data.items ? data.items[0] : 'No hay items');
        
        if (!data.items) {
            return res.json({ items: [] });
        }

        // Transformar los datos al formato que espera el frontend
        const transformedData = {
            items: data.items.map(item => ({
                id: item.id,
                volumeInfo: {
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors,
                    description: item.volumeInfo.description,
                    imageLinks: item.volumeInfo.imageLinks,
                    publishedDate: item.volumeInfo.publishedDate,
                    pageCount: item.volumeInfo.pageCount,
                    categories: item.volumeInfo.categories,
                    language: item.volumeInfo.language
                }
            }))
        };
        
        return res.json(transformedData);
    } catch (error) {
        console.error('Error detallado al buscar libros:', error);
        return res.status(500).json({ 
            message: 'Error al buscar libros',
            error: error.message 
        });
    }
};

const addBookFromGoogle = async (req, res) => {
    try {
        const bookData = req.body;
        
        const newBook = await Book.create({
            title: bookData.title || 'Sin título',
            author: bookData.authors ? bookData.authors.join(', ') : 'Autor desconocido',
            isbn: bookData.industryIdentifiers ? 
                bookData.industryIdentifiers[0].identifier : 'ISBN no disponible',
            description: bookData.description || 'Sin descripción',
            publishedDate: bookData.publishedDate || null,
            pageCount: bookData.pageCount || 0,
            imageUrl: bookData.imageLinks ? bookData.imageLinks.thumbnail : null,
            quantity: 1
        });
        
        return res.status(201).json(newBook);
    } catch (error) {
        console.error('Error detallado al agregar libro:', error);
        return res.status(500).json({ 
            message: 'Error al agregar libro',
            error: error.message 
        });
    }
};

module.exports = {
    searchBooks,
    addBookFromGoogle
}; 