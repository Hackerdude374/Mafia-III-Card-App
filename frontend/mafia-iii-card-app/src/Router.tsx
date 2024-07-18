import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AddCard from './pages/AddCard';
import EditCard from './pages/EditCard';
import Navbar from './components/Navbar';
import { LikesDislikesProvider } from './context/LikesDislikesContext';

const AppRouter: React.FC = () => {
  return (
    <LikesDislikesProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-card" element={<AddCard />} />
            <Route path="/edit-card/:id" element={<EditCard />} />
          </Routes>
        </div>
      </Router>
    </LikesDislikesProvider>
  );
};

export default AppRouter;
