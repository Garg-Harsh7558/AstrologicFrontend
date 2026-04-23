import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

/**
 * MainLayout Component
 * Provides a persistent Navbar and a container for the main application pages.
 */
function MainLayout() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
