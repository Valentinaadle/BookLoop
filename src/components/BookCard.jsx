export default function BookCard({ image, title = "Título del Libro", author = "Autor del Libro", price = "$99.99" }) {
    return (

      
      <div className="book-card">
        <a href="/">
          <img src={image} alt={title} />
          <div className="book-card-content">
            <h3>{title}</h3>
            <p>{author}</p>
            <div className="price-container">
              <p className="price">{price}</p>
              <button className="buy-button">Comprar</button>
            </div>
          </div>
        </a>
      </div>
    );
  }
  