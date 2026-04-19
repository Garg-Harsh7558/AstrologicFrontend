import React from 'react';
import Navbar from '../components/Navbar';
import bgImg from '../assets/bg.png';

/**
 * Home Component (Dashboard)
 * The main landing page
 */
function Home() {
  return (
    <div className="min-h-screen w-full bg-[#050508] relative overflow-hidden font-['Outfit']">
      <Navbar />
      
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      <main className="relative z-10 pt-12 px-10 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent mb-4">
            Celestial Insights
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-light leading-relaxed">
            Welcome back to your cosmic sanctuary. Your charts are aligned, and the stars are ready to reveal their secrets.
          </p>
        </header>

        {/* Placeholder for Astrology Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-purple-500/20 transition-all duration-500 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a4 4 0 018 0v1a2 2 0 002 2h2a1 1 0 001-1v-1a7 7 0 00-14 0v1a1 1 0 001 1h2a2 2 0 002-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Daily Horoscope</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Unlock the daily movements of your ruling planets and how they influence your path today.
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Decorative stars */}
      <div className="absolute top-[30%] right-[10%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
      <div className="absolute bottom-[40%] left-[8%] w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_#a855f7]"></div>
    </div>
  );
}

export default Home;
