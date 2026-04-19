import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import bgImg from '../assets/bg.png';

/**
 * ForgotPassword Component
 * Allows users to request an OTP for password reset.
 */
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [useEmail, setUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = useEmail ? { email } : { username };
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', payload);
      
      setMessage({ type: 'success', text: 'The stars have aligned. Check your email for the reset code.' });
      
      // Navigate with query parameters for 100% reliability
      const identifier = useEmail ? email : username;
      const type = useEmail ? 'email' : 'username';
      
      setTimeout(() => {
        navigate(`/reset-password?id=${encodeURIComponent(identifier)}&type=${type}`);
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'The cosmic connection failed. Ensure your details are correct.';
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
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-purple-500/30">
          
          {/* Header Section */}
          <div className="pt-12 pb-6 px-10 text-center">
            <div className="inline-block mb-4 p-3 rounded-full bg-linear-to-br from-purple-500/10 to-indigo-500/10 border border-white/10">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-linear-to-r from-white via-white to-purple-200 bg-clip-text">
              Restore Access
            </h1>
            <p className="text-slate-400 text-sm font-light">Invoke the cosmic reset for your portal</p>
          </div>

          {/* Toggle Tabs */}
          <div className="px-10 mb-8">
            <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 relative">
              <div 
                className={`absolute inset-y-1 transition-all duration-300 ease-out bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg ${useEmail ? 'left-1 right-[50%]' : 'left-[50%] right-1'}`}
              ></div>
              <button 
                onClick={() => setUseEmail(true)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider z-10 transition-colors duration-300 ${useEmail ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Email
              </button>
              <button 
                onClick={() => setUseEmail(false)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider z-10 transition-colors duration-300 ${!useEmail ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Username
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-5">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z" />
                </svg>
                <input 
                  type="text" 
                  placeholder={useEmail ? "Registered Email" : "Registered Username"}
                  value={useEmail ? email : username} 
                  onChange={(e) => useEmail ? setEmail(e.target.value) : setUsername(e.target.value)}
                  disabled={loading}
                  className={`bg-transparent border-none text-white text-sm w-full focus:ring-0 focus:outline-none placeholder-slate-600 ${loading ? 'opacity-50' : ''}`}
                />
              </div>
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
                  Send Spirit Code
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-slate-500 text-xs mt-6">
              Recalled your path? <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Return to Portal</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
      <div className="absolute bottom-[20%] left-[15%] w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_#a855f7]"></div>
      <div className="absolute top-10 right-10 w-48 h-48 border border-white/[0.03] rounded-full animate-spin-slow pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 border border-white/[0.03] rounded-full animate-reverse-spin-slow pointer-events-none"></div>
    </div>
  );
}

export default ForgotPassword;
