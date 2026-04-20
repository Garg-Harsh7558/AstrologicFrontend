import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import bgImg from '../assets/bg.png';

/**
 * ResetPassword Component
 * Allows users to enter OTP and new password to restore account access.
 */
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get('id');
  const type = searchParams.get('type');
  
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!identifier || !type) {
      setMessage({ type: 'error', text: 'No reset session found. Please start from the Forgot Password page.' });
      const timer = setTimeout(() => navigate('/forgot-password'), 3000);
      return () => clearTimeout(timer);
    }
  }, [identifier, type, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not align. Please check again.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        [type]: identifier,
        otpCode,
        password
      };
      
      const response = await api.post('/auth/verify-otp-for-password-reset', payload);
      
      setMessage({ type: 'success', text: 'Account restored! Your new path is set.' });
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'The reset failed. Is your Spirit Code correct?';
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
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-purple-500/30">
          
          {/* Header Section */}
          <div className="pt-12 pb-6 px-10 text-center">
            <div className="inline-block mb-4 p-3 rounded-full bg-linear-to-br from-purple-500/10 to-indigo-500/10 border border-white/10">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.353 11.353 0 00-1.13 6.645a11.353 11.353 0 002.321 6.377A11.532 11.532 0 0012 21.23a11.532 11.532 0 008.427-2.224a11.353 11.353 0 002.321-6.377a11.353 11.353 0 00-1.13-6.645z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-linear-to-r from-white via-white to-purple-200 bg-clip-text">
              Finalize Reset
            </h1>
            <p className="text-slate-400 text-sm font-light">Enter the Spirit Code and your new credentials</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Spirit Code (OTP)"
                  value={otpCode} 
                  onChange={(e) => setOtpCode(e.target.value)}
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
                  placeholder="New Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={`bg-transparent border-none text-white text-sm w-full focus:ring-0 focus:outline-none placeholder-slate-600 ${loading ? 'opacity-50' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1.5 ring-1 ring-white/10 rounded-2xl focus-within:ring-purple-500/50 transition-all duration-300 bg-black/20">
              <div className="flex items-center px-4 py-3.5">
                <svg className="w-5 h-5 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.353 11.353 0 00-1.13 6.645a11.353 11.353 0 002.321 6.377A11.532 11.532 0 0012 21.23a11.532 11.532 0 008.427-2.224a11.353 11.353 0 002.321-6.377a11.353 11.353 0 00-1.13-6.645z" />
                </svg>
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Seal New Password
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
      <div className="absolute bottom-[20%] left-[15%] w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_#a855f7]"></div>
      <div className="absolute top-10 right-10 w-48 h-48 border border-white/5 rounded-full animate-spin-slow pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 border border-white/5 rounded-full animate-reverse-spin-slow pointer-events-none"></div>
    </div>
  );
}

export default ResetPassword;
