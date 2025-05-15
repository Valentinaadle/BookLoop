
import '../Assets/css/bookcard.css'; // Importa el archivo CSS

export default function BookCard({ image, title = "Título del Libro", author = "Autor del Libro", price = "$99.99" }) {
  return (
    <div className="book-card">
      <a href="/">
        <img src={image} alt={title} />
        <div className="book-card-content">
          <h3>{title}</h3>
          <p>{author}</p>
          <p className="price">{price}</p>
          <div className="price-container">
            <button className="buy-button">Comprar</button>
            <img src="/icons/favorito.png" className="icon" alt="favorito" />
          </div>
        </div>
      </a>
    </div>
  );
}