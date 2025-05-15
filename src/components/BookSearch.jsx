import React, { useState } from 'react';
import axios from 'axios';
import '../Assets/css/BookSearch.css';

const BookSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/books/search?query=${encodeURIComponent(searchTerm)}`);
            setBooks(response.data);
        } catch (err) {
            setError('Error al buscar libros');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (googleBookId) => {
        try {
            await axios.post('http://localhost:5000/api/books/google', { googleBookId });
            alert('Libro agregado exitosamente');
        } catch (err) {
            alert('Error al agregar el libro');
            console.error('Error:', err);
        }
    };

    return (
        <div className="container">
            <div className="book-search">
                <h2>Búsqueda de Libros</h2>
                
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar libros..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                <div className="books-grid">
                    {books.map((book) => (
                        <div key={book.id} className="book-card">
                            {book.imageUrl && (
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="book-image"
                                />
                            )}
                            <div className="book-info">
                                <h3>{book.title}</h3>
                                <p><strong>Autor:</strong> {book.author}</p>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                {book.description && (
                                    <p className="description">
                                        {book.description.length > 150
                                            ? `${book.description.substring(0, 150)}...`
                                            : book.description}
                                    </p>
                                )}
                                <button
                                    onClick={() => handleAddBook(book.id)}
                                    className="add-button"
                                >
                                    Agregar a la biblioteca
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookSearch; 