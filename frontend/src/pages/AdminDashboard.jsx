import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Handlers para borrar y editar

  // Eliminar libro
  const handleDeleteBook = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este libro?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar libro');
      fetchData();
    } catch (err) {
      setError('Error al borrar libro');
    }
    setDeleting(false);
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro que deseas desactivar este usuario?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar usuario');
      fetchData();
    } catch (err) {
      setError('Error al borrar usuario');
    }
    setDeleting(false);
  };

  // Editar libro
  const handleEditBook = (id) => {
    window.location.href = `/edit-book/${id}`;
  };

  // Editar usuario
  const handleEditUser = (id) => {
    window.location.href = `/edit-user/${id}`;
  };

  const fetchData = async () => {
    try {
      setError(null);
      // Libros
      const booksRes = await fetch(`${API_URL}/api/books`);
      if (!booksRes.ok) throw new Error('Error al cargar libros');
      const booksData = await booksRes.json();
      setBooks(Array.isArray(booksData) ? booksData : []);
      // Usuarios
      const usersRes = await fetch(`${API_URL}/api/users`);
      if (!usersRes.ok) throw new Error('Error al cargar usuarios');
      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
      console.log('Libros recibidos:', booksData);
      console.log('Usuarios recibidos:', usersData);
    } catch (err) {
      setError('Error al cargar datos. Revisa la consola.');
      console.error('Error al cargar datos del admin:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div>No autorizado</div>;
  }

  if (loading || deleting) return <div>Cargando...</div>;

  return (
    <>
      <Header />
      <main style={{padding: '2rem 0', color: '#222'}}>
        <h1 style={{textAlign:'center'}}>Panel de Administrador</h1>
        {error && <div style={{color:'red',textAlign:'center',marginBottom:'1rem'}}>{error}</div>}
        <div style={{display:'flex',gap:'2rem',justifyContent:'center',flexWrap:'wrap'}}>
          <section>
            <h2>Libros</h2>
            <ul style={{listStyle:'none',padding:0}}>
              {books.map(book => (
                <li key={book.book_id || book.id} style={{marginBottom:'0.5rem',borderBottom:'1px solid #eee',paddingBottom:'0.5rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                  <span style={{flex:1}}>{book.titulo} - {book.autor} (${book.precio})</span>
                  <button onClick={() => window.location.href = `/book/${book.book_id || book.id}`} style={{ display:'flex', alignItems:'center', gap:4 }}>
                    Ver detalles
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Usuarios</h2>
            <ul style={{listStyle:'none',padding:0}}>
              {users.filter(u => u.role === "user").map(u => (
                <li key={u.user_id || u.id} style={{marginBottom:'0.5rem',borderBottom:'1px solid #eee',paddingBottom:'0.5rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                  <span style={{flex:1}}>{u.nombre} {u.apellido} ({u.email}) - {u.role}</span>
                  <button onClick={() => handleDeleteUser(u.user_id || u.id)} style={{color:'white',background:'#d32f2f',border:'none',padding:'0.3rem 0.7rem',borderRadius:4, display:'flex', alignItems:'center', gap:4}}>
                    <FaTrash style={{marginRight:4}} /> Borrar
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminDashboard;
