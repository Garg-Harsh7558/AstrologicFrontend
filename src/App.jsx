import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';
import Verify from './auth/verify';
import ForgotPassword from './auth/forgotpassword';
import ResetPassword from './auth/resetpassword';
import Home from './pages/Home';
import Birthdetails from './components/charts/birthdetails';
import Displaycharts from './components/charts/displaycharts';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050508] text-white">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Current Main App Route */}
          <Route path="/" element={<Home />} />
          <Route path="/birthdetails" element={<Birthdetails />} />
          <Route path="/displaycharts" element={<Displaycharts />} />
          
          {/* Fallback */}
          <Route path="*" element={
            <div className="h-screen flex flex-col items-center justify-center space-y-4">
              <h1 className="text-6xl font-black text-purple-500 animate-pulse">404</h1>
              <p className="text-slate-400 text-lg">Lost in the astral plane...</p>
              <button 
                onClick={() => window.history.back()}
                className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
              >
                Go Back
              </button>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
