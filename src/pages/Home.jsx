import { useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from "../components/BookCard";
import "../Assets/css/home.css";
import "../Assets/css/header.css";
import "../Assets/css/footer.css";
import "../Assets/css/filtro.css";
import book1 from "../Assets/book1.webp";
import book2 from "../Assets/book2.webp";
import book3 from "../Assets/book3.webp";
import book4 from "../Assets/book4.webp";
import book5 from "../Assets/book5.webp";
import book6 from "../Assets/book6.webp";
import book7 from "../Assets/book7.webp";
import book8 from "../Assets/book8.webp";
import book9 from "../Assets/book9.webp";
import book10 from "../Assets/book10.webp";
import book11 from "../Assets/book11.webp";
import book12 from "../Assets/book12.webp";

const booksData = [
  { id: 1, image: book1, title: "Título", author: "Autor", price: "$99.99" },
  { id: 2, image: book2, title: "Título", author: "Autor", price: "$99.99" },
  { id: 3, image: book3, title: "Título", author: "Autor", price: "$99.99" },
  { id: 4, image: book4, title: "Título", author: "Autor", price: "$99.99" },
  { id: 5, image: book5, title: "Título", author: "Autor", price: "$99.99" },
  { id: 6, image: book6, title: "Título", author: "Autor", price: "$99.99" },
  { id: 7, image: book7, title: "Título", author: "Autor", price: "$99.99" },
  { id: 8, image: book8, title: "Título", author: "Autor", price: "$99.99" },
  { id: 9, image: book9, title: "Título", author: "Autor", price: "$99.99" },
  { id: 10, image: book10, title: "Título", author: "Autor", price: "$99.99" },
  { id: 11, image: book11, title: "Título", author: "Autor", price: "$99.99" },
  { id: 12, image: book12, title: "Título", author: "Autor", price: "$99.99" },
];

export default function Home() {
  const [collapsed, setCollapsed] = useState({
    genero: false,
    idioma: false,
    estado: false,
  });

  const toggle = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Header />
      <main className="home-container">
        <aside className="sidebar">
          <h3 className="sidebar-title">Filtrar</h3>
          
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("genero")}>
              Género <span>{collapsed.genero ? "-" : "+"}</span>
            </div>
            <div className={`filter-options ${collapsed.genero ? "" : "collapsed"}`}>
              {[
                "Novela", "Cuento", "Poesía", "Drama", "Ciencia ficción",
                "Fantasía", "Misterio", "Terror", "Romance", "Deportes",
                "Realistas", "Salud", "Tecnología"
              ].map((genre) => (
                <label key={genre}>
                  <input type="checkbox" /> {genre}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("idioma")}>
              Idioma <span>{collapsed.idioma ? "-" : "+"}</span>
            </div>
            <div className={`filter-options ${collapsed.idioma ? "" : "collapsed"}`}>
              {["Español", "Inglés", "Francés"].map((lang) => (
                <label key={lang}>
                  <input type="checkbox" /> {lang}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("estado")}>
              Estado <span>{collapsed.estado ? "-" : "+"}</span>
            </div>
            <div className={`filter-options ${collapsed.estado ? "" : "collapsed"}`}>
              {["Nuevo", "Usado"].map((state) => (
                <label key={state}>
                  <input type="checkbox" /> {state}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="books-grid">
          {booksData.map((book) => (
            <BookCard
              key={book.id}
              image={book.image}
              title={book.title}
              author={book.author}
              price={book.price}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
