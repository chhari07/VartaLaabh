// src/App.js

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/Aboutus";
import Categories from "./components/Categories";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import { AuthProvider } from "./Firebase/AuthContext";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Contactus from "./pages/Contactus";
import Features2 from "./pages/Features2";
import Howitworks from "./components/Howitworks";
import SplashScreen from "./components/SplashScreen";
import OurVision from "./pages/OurVIsion";
import BlogBazzer from "./pages/features_/BlogBazzer";
import KaaryaKendra from "./pages/features_/KaaryaKendra";
import Poochhobolo from "./pages/features_/Poochhobolo";
import Samuhik_charcha from "./pages/features_/Samuhik_charcha";
import PrivateRoute from "./components/PrivateRoute"; // <-- Import here

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Howitworks" element={<Howitworks />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/features" element={<Features2 />} />
            <Route path="/ourvision" element={<OurVision />} />
            <Route path="/blogbazzar" element={<BlogBazzer />} />
            <Route path="/poochho-bolo" element={<Poochhobolo />} />
            <Route path="/samuhik-charcha" element={<Samuhik_charcha />} />
            <Route path="/kaarya-kendra'" element={<KaaryaKendra />} />


            {/* Protected Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
