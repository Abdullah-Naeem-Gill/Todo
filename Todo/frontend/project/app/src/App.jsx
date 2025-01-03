import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/signUp'; // Corrected path
import AdminSignUp from './components/AdminSignUp'; // Assuming you have AdminSignUp component
import AdminLogin from './components/AdminLogin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing page */}
        <Route path="/login" element={<Login />} /> {/* User login */}
        <Route path="/login/user" element={<Login />} /> {/* Login as User */}
        <Route path="/admin/login" element={<AdminLogin />} /> {/* Admin login */}
        <Route path="/admin/signup" element={<AdminSignUp />} /> {/* Admin sign-up */}
        
        {/* Define the SignUp route */}
        <Route path="/signup" element={<SignUp/>} /> {/* User sign-up */}
      </Routes>
    </Router>
  );
};

export default App;
