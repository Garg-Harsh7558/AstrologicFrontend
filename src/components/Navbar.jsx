import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.jpeg';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 w-full z-100 backdrop-blur-md bg-black/40 border-b border-white/5 px-4 md:px-10 py-4 font-['Outfit']">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 flex rounded-lg bg-linear-to-br from-purple-500/20 to-indigo-500/20 border border-white/10">
            <img src={logo} className='rounded-full mr-4' alt="Astro Logic Logo" width="30" height="30" />
            <span className="text-xl font-bold text-white tracking-tight">AstroLogic</span>

          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/birthdetails" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Birth Details</Link>
          <Link to="/displaycharts" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Display Charts</Link>
          <button 
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-red-400 text-sm font-semibold transition-all duration-300 flex items-center gap-2"
          >
            <span>Sign Out</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#050508]/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 space-y-6 flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-purple-400 transition-colors">Dashboard</Link>
          <Link to="/birthdetails" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-purple-400 transition-colors">Birth Details</Link>
          <Link to="/displaycharts" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-purple-400 transition-colors">Display Charts</Link>
          <hr className="border-white/5" />
          <button 
            onClick={() => {handleLogout(); setIsOpen(false);}}
            className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold flex items-center justify-center gap-3"
          >
            <span>Sign Out</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

