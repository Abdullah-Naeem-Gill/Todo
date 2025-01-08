import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/User/LandingPage";
import Login from "./components/User/Login";
import SignUp from "./components/User/signUp";
import AdminSignUp from "./components/Admin/AdminSignUp";
import AdminLogin from "./components/Admin/Login";
import AdminDashboard from "./components/Admin/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
