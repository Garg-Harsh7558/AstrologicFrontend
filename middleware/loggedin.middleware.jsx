import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../src/api/axios';

function LoggedInMiddleware() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await api.post("/astro/loggedin");
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };
    checkLogin();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default LoggedInMiddleware;