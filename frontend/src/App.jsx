import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { FavoritesProvider } from './context/FavoritesContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import BookDetails from './pages/BookDetails';
import Portada from './pages/Portada';
import Search from './pages/Search';
import Books from './pages/Books';
import QuieroVender from './pages/QuieroVender';
import EditBook from './pages/EditBook';
import EditBookUser from './pages/EditBookUser';
import Comprar from './pages/Comprar';
import Favoritos from './pages/Favoritos';
import FAQQuestions from './components/FAQQuestion';
import About from './pages/About';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        
          <Router>
          <Routes>
            <Route path="/" element={<Portada />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/comprar" element={
              <ProtectedRoute>
                <Comprar />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } />
            <Route path="/books" element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/favoritos" element={
              <ProtectedRoute>
                <Favoritos />
              </ProtectedRoute>
            } />
            <Route path="/book/:id" element={
              <ProtectedRoute>
                <BookDetails />
              </ProtectedRoute>
            } />
            <Route path="/edit-book/:id" element={
              <ProtectedRoute>
                <EditBook />
              </ProtectedRoute>
            } />
            <Route path="/edit-book-user/:id" element={
              <ProtectedRoute>
                <EditBookUser />
              </ProtectedRoute>
            } />
            <Route path="/vender-page" element={
              <ProtectedRoute>
                <QuieroVender />
              </ProtectedRoute>
            } />
            <Route path="/preguntas" element={
              <ProtectedRoute>
                <FAQQuestions />
              </ProtectedRoute>
            } />
            <Route path="/nosotros" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
        
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;