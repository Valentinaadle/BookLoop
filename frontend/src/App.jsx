import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import BookDetails from './pages/BookDetails';
import Portada from './pages/Portada';
import Search from './pages/Search';
import Books from './pages/Books';
import QuieroVender from './pages/QuieroVender';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portada />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/vender-page" element={<QuieroVender />} />
      </Routes>
    </Router>
  );
}

export default App;