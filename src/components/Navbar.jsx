import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Calling the backend logout endpoint
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/5 px-6 py-4 flex items-center justify-between font-['Outfit']">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-linear-to-br from-purple-500/20 to-indigo-500/20 border border-white/10">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">AstroLogic</span>
      </div>

      <div className="flex items-center gap-6">
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
    </nav>
  );
}

export default Navbar;
