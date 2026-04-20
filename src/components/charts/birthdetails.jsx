import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../Navbar';

/**
 * Birthdetails Component
 */
function Birthdetails() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [ordinates, setOrdinates] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [date, setDate] = useState(new Date().getDate());
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const fetchingordinates = async (searchCity) => {
    if (!searchCity || searchCity.length < 3) return;
    setLoading(true);
    try {
      const response = await api.post(`/astro/get-geocode`, { city: searchCity });
      setOrdinates(response.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError("Please select a location from the search results.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        name, year, month, date, hours, minutes, seconds,
        latitude, longitude,
        timezone: 5.5, // Default for India, can be made dynamic
      };
      await api.post(`/astro/take-birth-details`, payload);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save details.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-['Outfit'] selection:bg-purple-500/30">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10"></div>

        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent tracking-tight mb-4">
            Birth Details
          </h1>
          <p className="text-slate-400 text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Align your destiny with the stars. Enter your precise birth information to generate your cosmic chart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Personal & Time Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 backdrop-blur-3xl shadow-2xl space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  required
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Johnathan Smith"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-slate-600 text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="number" 
                    value={date} 
                    required
                    min="1" max="31"
                    onChange={(e) => setDate(e.target.value)} 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Month</label>
                  <input 
                    type="number" 
                    value={month} 
                    required
                    min="1" max="12"
                    onChange={(e) => setMonth(e.target.value)} 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Year</label>
                  <input 
                    type="number" 
                    value={year} 
                    required
                    onChange={(e) => setYear(e.target.value)} 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Hours (24h)</label>
                  <input 
                    type="number" 
                    value={hours} 
                    required
                    min="0" max="23"
                    onChange={(e) => setHours(e.target.value)} 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Minutes</label>
                  <input 
                    type="number" 
                    value={minutes} 
                    required
                    min="0" max="59"
                    onChange={(e) => setMinutes(e.target.value)} 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Seconds</label>
                  <input 
                    type="number" 
                    value={seconds} 
                    min="0" max="59"
                    onChange={(e) => setSeconds(e.target.value)} 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Location Discovery */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Birth Location</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    onKeyDown={(e) => {
                      // Trigger search when a character key is pressed and current length + 1 >= 3
                      if (e.key.length === 1 && e.target.value.length >= 2) {
                        fetchingordinates(e.target.value + e.key);
                      }
                    }}
                    placeholder="Search your birth city..."
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 pr-12"
                  />
                  {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {ordinates.length > 0 ? (
                    ordinates.map((item) => (
                      <button
                        key={item.place_id || item.id}
                        type="button"
                        onClick={() => {
                          setLatitude(item.lat);
                          setLongitude(item.lon);
                          setCity(item.display_name);
                          setSelectedLocation(item.display_name);
                          setOrdinates([]);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                          latitude === item.lat 
                            ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.08] hover:border-white/10'
                        }`}
                      >
                        <p className={`text-sm font-medium ${latitude === item.lat ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {item.display_name}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Lat: {parseFloat(item.lat).toFixed(4)}</span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Lon: {parseFloat(item.lon).toFixed(4)}</span>
                        </div>
                      </button>
                    ))
                  ) : city.length >= 3 && !loading ? (
                    <p className="text-center py-8 text-slate-500 text-sm italic">Search results will appear here...</p>
                  ) : null}
                </div>

                {latitude && (
                  <div className="mt-auto p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-3xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em]">Location Locked</span>
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-200 line-clamp-1 mb-2">{selectedLocation}</p>
                    <div className="flex gap-4 text-[11px] font-mono text-slate-400">
                      <span>{latitude}° N</span>
                      <span>{longitude}° E</span>
                    </div>
                  </div>
                )}
              </div>

              <button 
                type='submit'
                disabled={loading || !latitude}
                className={`mt-6 w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-all duration-500 ${
                  !latitude || loading
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-white text-black hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                }`}
              >
                {loading ? 'Processing...' : 'Generate Profile'}
              </button>
            </div>
          </div>
        </form>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  )
}

export default Birthdetails;
