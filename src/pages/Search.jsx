import React from 'react';
import BookSearch from '../components/BookSearch';
import '../Assets/css/Search.css';

const Search = () => {
    return (
        <div className="search-page">
            <header className="search-header">
                <h1>Búsqueda de Libros</h1>
            </header>
            <main className="search-main">
                <BookSearch />
            </main>
        </div>
    );
};

export default Search; 