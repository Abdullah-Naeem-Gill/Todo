import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AdminSignUp from './components/AdminSignUp';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing page */}
        <Route path="/login/user" element={<Login />} /> {/* User login */}
        <Route path="/signup" element={<SignUp />} /> {/* User sign-up */}
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} /> {/* Admin login */}
        <Route path="/admin/signup" element={<AdminSignUp />} /> {/* Admin sign-up */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Admin dashboard */}
      </Routes>
    </Router>
  );
};

export default App;
