import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching book with ID:', id); // Para debugging
        const response = await fetch(`http://localhost:5000/api/books/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Book data received:', data); // Para debugging
        setBook(data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('No se pudo cargar el libro. ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Cargando detalles del libro...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error">{error}</div>
        <Footer />
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Header />
        <div className="error">No se encontró el libro</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="breadcrumb">
          <span>Inicio / Libros / {book.category || 'Categoría'}</span>
        </div>
        
        <section className="book-info">
          <div className="book-header">
            {book.isNew && <span className="new-badge">Novedad</span>}
            <h1 className="book-title">{book.title}</h1>
            <p className="book-subtitle">{book.subtitle}</p>
            <p className="book-author">{book.author || book.authors?.join(', ') || 'Autor desconocido'}</p>
          </div>

          <div className="book-content">
            <div className="book-left-column">
              <div className="book-cover">
                <img 
                  src={book.imageUrl || book.imageLinks?.thumbnail || '/placeholder-book.png'} 
                  alt={`Portada ${book.title}`}
                  onError={(e) => {
                    e.target.src = '/placeholder-book.png';
                    e.target.onerror = null;
                  }}
                />
              </div>
            </div>

            <div className="book-right-column">
              <div className="book-details">
                <h3>Detalles del libro:</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span>Editorial:</span>
                    <span>{book.publisher || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <span>Temática:</span>
                    <span>{book.category || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <span>Número de páginas:</span>
                    <span>{book.pages || 'No especificado'}</span>
                  </div>
                </div>
              </div>

              <div className="book-synopsis">
                <h3>Sinopsis de {book.title}:</h3>
                <p className="book-description">{book.description || 'Sin descripción disponible'}</p>
                <button className="read-more">Leer más</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .breadcrumb {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .book-header {
          margin-bottom: 30px;
          padding: 0 40px;
        }

        .new-badge {
          background: #4CAF50;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 10px;
        }

        .book-title {
          font-size: 32px;
          color: #333;
          margin: 0 0 10px 0;
        }

        .book-subtitle {
          font-size: 18px;
          color: #666;
          margin: 0 0 10px 0;
        }

        .book-author {
          font-size: 18px;
          color: #0066cc;
          margin: 0;
        }

        .book-content {
          display: flex;
          gap: 40px;
          padding: 0 40px;
        }

        .book-left-column {
          width: 300px;
          flex-shrink: 0;
        }

        .book-right-column {
          flex-grow: 1;
        }

        .book-cover {
          background: white;
          width: 250px;
          height: 350px;
        }

        .book-cover img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: inherit;
          border-bottom: 1px solid #eee;
          transition: transform 0.2s;
        }

        .book-details {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .book-details h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .details-grid {
          display: grid;
          gap: 10px;
        }

        .detail-item {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 10px;
        }

        .detail-item span:first-child {
          color: #666;
        }

        .book-synopsis {
          background: white;
          border-radius: 8px;
          padding: 20px;
        }

        .book-synopsis h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .book-description {
          color: #444;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .read-more {
          background: none;
          border: none;
          color: #0066cc;
          padding: 0;
          cursor: pointer;
          font-size: 14px;
        }

        .read-more:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .book-content {
            flex-direction: column;
            padding: 0 20px;
          }

          .book-header {
            padding: 0 20px;
          }

          .book-left-column {
            width: 100%;
          }

          .book-cover img {
            max-height: 500px;
            object-position: top;
          }
        }
      `}</style>
    </>
  );
}

export default BookDetails;