import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Assets/css/books.css';

const Books = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/books');
            setBooks(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los libros');
            setLoading(false);
            console.error('Error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
            try {
                await axios.delete(`http://localhost:5000/api/books/${id}`);
                setBooks(books.filter(book => book.id !== id));
            } catch (err) {
                alert('Error al eliminar el libro');
                console.error('Error:', err);
            }
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`http://localhost:5000/api/books/${id}`, updatedData);
            setBooks(books.map(book => 
                book.id === id ? { ...book, ...updatedData } : book
            ));
            setEditingBook(null);
        } catch (err) {
            alert('Error al actualizar el libro');
            console.error('Error:', err);
        }
    };

    if (loading) return <div className="books-loading">Cargando libros...</div>;
    if (error) return <div className="books-error">{error}</div>;

    return (
        <div className="books-page">
            <header className="books-header">
                <h1>Mi Biblioteca</h1>
                <div className="header-content">
                    <p>Total de libros: {books.length}</p>
                    <button 
                        className="add-books-button"
                        onClick={() => navigate('/search')}
                    >
                        Agregar Libros
                    </button>
                </div>
            </header>

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
                            {editingBook === book.id ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        defaultValue={book.title}
                                        onChange={(e) => book.title = e.target.value}
                                    />
                                    <input
                                        type="number"
                                        defaultValue={book.quantity}
                                        onChange={(e) => book.quantity = parseInt(e.target.value)}
                                    />
                                    <div className="edit-buttons">
                                        <button onClick={() => handleUpdate(book.id, book)}>
                                            Guardar
                                        </button>
                                        <button onClick={() => setEditingBook(null)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3>{book.title}</h3>
                                    <p><strong>Autor:</strong> {book.author}</p>
                                    <p><strong>ISBN:</strong> {book.isbn}</p>
                                    <p><strong>Cantidad:</strong> {book.quantity}</p>
                                    {book.description && (
                                        <p className="description">
                                            {book.description.length > 150
                                                ? `${book.description.substring(0, 150)}...`
                                                : book.description}
                                        </p>
                                    )}
                                    <div className="book-actions">
                                        <button
                                            onClick={() => setEditingBook(book.id)}
                                            className="edit-button"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="delete-button"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Books; 