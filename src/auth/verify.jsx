import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import bgImg from '../assets/bg.png';

/**
 * Premium Verification (OTP) Component
 * High-end Astrology theme for verifying user identity.
 */
function Verify() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();



  const handleResendOtp = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Email is required to resend code.' });
      return;
    }
    setResending(true);
    setMessage({ type: 'success', text: 'Resending code...' });
    try {
      await api.post('/auth/verify-email', { email });
      setOtp('');
      setMessage({ type: 'success', text: 'A new code has been sent to your email.' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to resend code.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp;
    if (otpCode.length < 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Backend expects 'otpCode' and 'email' or 'username'
      const response = await api.post('/auth/verify-otp', {
        email,
        otpCode
      });
      setMessage({ type: 'success', text: 'Identity verified! You can now sign in.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Invalid verification code. Please try again.';
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-linear-to-r from-white via-white to-purple-200 bg-clip-text">
              Verify Energy
            </h1>
            <p className="text-slate-400 text-sm font-light">Enter the 6-digit code sent to your email</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-6">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input 
                  type="email" 
                  placeholder="Confirm celestial email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || resending}
                  className={`bg-transparent border-none text-white text-sm w-full focus:ring-0 focus:outline-none placeholder-slate-600 ${loading || resending ? 'opacity-50' : ''}`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 ring-1 ring-white/10 rounded-2xl focus-within:ring-purple-500/50 transition-all duration-300 bg-black/20">
              <div className="flex items-center px-4 py-4">
                <svg className="w-5 h-5 text-slate-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit cosmic code"
                  value={otp} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                  }}
                  disabled={loading || resending}
                  className={`bg-transparent border-none text-white text-xl font-bold tracking-[0.5em] w-full focus:ring-0 focus:outline-none placeholder:text-slate-600 placeholder:text-sm placeholder:tracking-normal ${loading || resending ? 'opacity-50' : ''}`}
                  required
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
                  Verify Code
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                  </svg>
                </>
              )}
            </button>

            <div className="text-center space-y-4">
              <p className="text-slate-500 text-xs">
                Didn't receive the vibe? <button type="button" onClick={handleResendOtp} disabled={resending} className={`text-purple-400 font-bold hover:text-purple-300 transition-colors ${resending ? 'opacity-50 pointer-events-none' : ''}`}>
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              </p>
              <Link to="/register" className="block text-[11px] text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-widest font-bold">Back to Registration</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
      <div className="absolute bottom-[20%] left-[15%] w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_#a855f7]"></div>
    </div>
  );
}

export default Verify;
