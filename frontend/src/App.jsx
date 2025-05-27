import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import BookDetails from './pages/BookDetails';
import Portada from './pages/Portada';
import Search from './pages/Search';
import Books from './pages/Books';
import QuieroVender from './pages/QuieroVender';
import EditBook from './pages/EditBook';

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
      <Router>
        <Routes>
          <Route path="/" element={<Portada />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comprar" element={
            <ProtectedRoute>
              <Books />
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
          <Route path="/vender-page" element={
            <ProtectedRoute>
              <QuieroVender />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;