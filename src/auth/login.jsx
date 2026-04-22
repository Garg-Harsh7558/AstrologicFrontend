import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import bgImg from '../assets/bg.png';

/**
 * Beautified Login Component
 * High-end Astrology theme with state-driven Email/Username toggle.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logInWithEmail, setLogInWithEmail] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = logInWithEmail ? { email, password } : { username, password };
      const response = await api.post('/auth/login', payload);
      
      setMessage({ type: 'success', text: 'Welcome back! Your path is clear.' });
      
      console.log("Login successful! Redirecting to Home in 1.5s...");
      setTimeout(() => {
        console.log("Navigating to Home Dashboard...");
        navigate('/');
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'The cosmic alignment was rejected. Try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050508] relative overflow-hidden font-['Outfit']">
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center transition-transform duration-[10s] ease-linear scale-110"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      
      {/* Mystical Overlay Gradients */}
      <div className="absolute inset-5 bg-linear-to-tr from-purple-900/20 via-transparent to-indigo-900/20"></div>

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[450px] p-4 animate-in fade-in zoom-in duration-700">
        <div 
          className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-purple-500/30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Header Section */}
          <div className="pt-8 md:pt-12 pb-6 px-6 md:px-10 text-center">
            <div className="inline-block mb-4 p-3 rounded-full bg-linear-to-br from-purple-500/10 to-indigo-500/10 border border-white/10">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 bg-linear-to-r from-white via-white to-purple-200 bg-clip-text">
              Astro Portal
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">Access your celestial charts and insights</p>
          </div>

          {/* Toggle Tabs */}
          <div className="px-6 md:px-10 mb-8">
            <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 relative">
              <div 
                className={`absolute inset-y-1 transition-all duration-300 ease-out bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg ${logInWithEmail ? 'left-[50%] right-1' : 'left-1 right-[50%]'}`}
              ></div>
              <button 
                onClick={() => setLogInWithEmail(false)}
                className={`flex-1 py-2 md:py-2.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider z-10 transition-colors duration-300 ${!logInWithEmail ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Username
              </button>
              <button 
                onClick={() => setLogInWithEmail(true)}
                className={`flex-1 py-2 md:py-2.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider z-10 transition-colors duration-300 ${logInWithEmail ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Email
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 md:px-10 pb-10 md:pb-12 space-y-5">
            {message.text && (
              <div className={`p-4 rounded-xl text-xs font-semibold text-center animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {message.text}
              </div>
            )}
            
            <div className="space-y-1.5 ring-1 ring-white/10 rounded-2xl focus-within:ring-purple-500/50 transition-all duration-300 bg-black/20">
              <div className="flex items-center px-4 py-3.5">
                <svg className="w-5 h-5 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input 
                  type="text" id="usernameoremail"
                  placeholder={logInWithEmail ? "Enter your email" : "Enter your username"}
                  value={logInWithEmail ? email : username} 
                  onChange={(e) => logInWithEmail ? setEmail(e.target.value) : setUsername(e.target.value)}
                  disabled={loading}
                  className={`bg-transparent border-none text-white text-sm w-full focus:ring-0 focus:outline-none placeholder-slate-600 ${loading ? 'opacity-50' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1.5 ring-1 ring-white/10 rounded-2xl focus-within:ring-purple-500/50 transition-all duration-300 bg-black/20">
              <div className="flex items-center px-4 py-3.5">
                <svg className="w-5 h-5 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={`bg-transparent border-none text-white text-sm w-full focus:ring-0 focus:outline-none placeholder-slate-600 ${loading ? 'opacity-50' : ''}`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-[11px] text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-widest font-bold">Lost Access?</Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-900/20 transform transition-all duration-200 active:scale-[0.98] hover:shadow-purple-500/30 text-sm uppercase tracking-widest flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-slate-500 text-xs mt-6">
              New seeker? <Link to="/register" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Join the Circle</Link>
            </p>
            <p className="text-center text-slate-500 text-xs mt-6">
              Registered but unverified? <Link to="/verify" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Verify</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Foreground Stars / Decorative */}
      <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
      <div className="absolute bottom-[20%] left-[15%] w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_#a855f7]"></div>
      
      {/* Background Rotating Circles (Restored) */}
      <div className="absolute top-10 right-10 w-48 h-48 border border-white/5 rounded-full animate-spin-slow pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 border border-white/5 rounded-full animate-reverse-spin-slow pointer-events-none"></div>
    </div>
  );
}

export default Login;