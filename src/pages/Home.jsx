import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import bgImg from '../assets/bg.png';

/**
 * Home Component (Dashboard)
 * Displays real-time Hora, Tithi, and Sunrise/Sunset data
 */
function Home() {
  const [data, setData] = useState(null);
  const [currentHora, setCurrentHora] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Helper to calculate current hora from full list
  const calculateCurrentHora = (horaList) => {
    if (!horaList) return null;
    const now = new Date();
    const horas = Object.values(horaList);
    const found = horas.find(h => {
      // Replace space with T for ISO compatibility
      const start = new Date(h.starts_at.replace(' ', 'T'));
      const end = new Date(h.ends_at.replace(' ', 'T'));
      return now >= start && now < end;
    });
    return found;
  };

  useEffect(() => {
    const getCelestialData = async () => {
      const now = new Date();
      const today = now.toDateString();
      const cachedDataString = localStorage.getItem('astro_daily_data');
      const cachedDate = localStorage.getItem('astro_data_date');

      if (cachedDataString && cachedDate) {
        const parsedData = JSON.parse(cachedDataString);
        
        // Check if data is for today or still valid from yesterday (pre-sunrise)
        let isDataValid = cachedDate === today;
        if (!isDataValid && parsedData.sun?.sun_rise_time) {
          const [h, m, s] = parsedData.sun.sun_rise_time.split(':');
          const sunriseThresholdToday = new Date(now);
          sunriseThresholdToday.setHours(parseInt(h), parseInt(m), parseInt(s));
          if (now < sunriseThresholdToday) isDataValid = true;
        }

        if (isDataValid) {
          const active = calculateCurrentHora(parsedData.yesterday) || calculateCurrentHora(parsedData.hora);
          if (active) {
            setData(parsedData);
            setCurrentHora(active);
            setLoading(false);
            return;
          }
        }
      }

      try {
        const response = await api.post('/astro/get-hora');
        if (response.data.success) {
          const freshData = response.data.data;
          const active = calculateCurrentHora(freshData.yesterday) || calculateCurrentHora(freshData.hora);
          
          setData(freshData);
          setCurrentHora(active);
          
          localStorage.setItem('astro_daily_data', JSON.stringify(freshData));
          localStorage.setItem('astro_data_date', today);
        }
      } catch (err) {
        console.error("Failed to fetch celestial data:", err);
      } finally {
        setLoading(false);
      }
    };

    getCelestialData();

    // Check for active hora changes every minute using both datasets
    const interval = setInterval(() => {
        setData(prev => {
            if (prev) {
                const active = calculateCurrentHora(prev.yesterday) || calculateCurrentHora(prev.hora);
                if (active) setCurrentHora(active);
            }
            return prev;
        });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return new Date(timeStr.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen w-full bg-[#050508] relative overflow-hidden font-['Outfit']">

      
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      <main className="relative z-10 pt-8 md:pt-12 px-4 md:px-10 max-w-7xl mx-auto">
        <header className="mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.3em]">Live Cosmic Alignment</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent pb-2 mb-6 tracking-tight leading-tight">
            Celestial Insights
          </h1>
          <p className="text-slate-400 text-base md:text-lg lg:text-xl max-w-2xl font-light leading-relaxed">
            The heavens are in constant motion. View the current planetary hour and lunar phase to align your actions with the universe.
          </p>
        </header>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] h-[300px] md:h-[350px] rounded-3xl md:rounded-4xl bg-white/5 border border-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : data && (
          <div className="space-y-6 md:space-y-10">
            
            {/* Top Overview Bar: Active Hora, Lunar, Solar in one rectangle */}
            <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl md:rounded-4xl p-1 md:p-1 hover:bg-white/5 transition-all duration-700 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                
                {/* Active Hora Section */}
                <div className="p-6 md:p-8 lg:p-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-2">Active Hora</p>
                      {!currentHora ? (
                        <h3 className="text-xl font-bold text-slate-400">Transitioning...</h3>
                      ) : (
                        <>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{currentHora?.lord}</h3>
                          <p className="text-slate-500 text-[10px] font-mono">{formatTime(currentHora?.starts_at)} — {formatTime(currentHora?.ends_at)}</p>
                        </>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center animate-spin-slow">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Lunar Phase Section */}
                <div className="p-6 md:p-8 lg:p-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-2">Lunar Phase</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{data.tithi?.name}</h3>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider">{data.tithi?.paksha} Paksha • {100 - data.tithi?.left_precentage}% Full</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Solar Cycle Section */}
                <div className="p-6 md:p-8 lg:p-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-2">Solar Cycle</p>
                      <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                         <span className="text-amber-400">{data.sun?.sun_rise_time.split(':').slice(0,2).join(':')}</span>
                         <span className="text-slate-600 text-sm">/</span>
                         <span className="text-orange-400">{data.sun?.sun_set_time.split(':').slice(0,2).join(':')}</span>
                      </h3>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider">Sunrise & Sunset</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center animate-pulse">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Hora today */}
            <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl md:rounded-4xl p-6 md:p-10 hover:bg-white/5 transition-all duration-700 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Planetary Schedule</h3>
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">24-Hour Hora Cycle (Today)</p>
                  </div>
                </div>
                {currentHora && (
                  <div className="bg-purple-500/10 border border-purple-500/30 px-6 py-2 rounded-full w-full md:w-auto text-center">
                    <span className="text-purple-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">Now: {currentHora.lord}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(data.hora).map(([num, hora]) => {
                  const isActive = hora.starts_at === currentHora?.starts_at;
                  return (
                    <div 
                      key={num} 
                      className={`relative overflow-hidden group p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 ${
                        isActive 
                          ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-[1.02]' 
                          : 'bg-black/20 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-0 right-0 p-2">
                           <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-mono ${isActive ? 'text-purple-400' : 'text-white'}`}>{num.padStart(2, '0')}</span>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-100'}`}>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                        </div>
                      </div>

                      <h4 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>{hora.lord}</h4>
                      <p className={`text-[10px] font-mono uppercase tracking-tighter ${isActive ? 'text-purple-400/80' : 'text-slate-500'}`}>
                        {formatTime(hora.starts_at)} - {formatTime(hora.ends_at)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Decorative stars */}
      <div className="absolute top-[30%] right-[10%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
      <div className="absolute bottom-[40%] left-[8%] w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_#a855f7]"></div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}

export default Home;

