import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

function Displaycharts() {
    const navigate = useNavigate();
    const [charts, setCharts] = useState({});
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('d1Chart'); 
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [datatoai, setDatatoai] = useState("");
    const fetchCharts = async () => {
        setLoading(true);
        try {
            const response = await api.post("/astro/display-charts", {});
            setCharts(response.data.chart);
            if (response.data.chart?.allchart?.length > 0) {
                // Keep the same profile selected if it still exists after refresh
                const currentName = selectedProfile?.name;
                const found = response.data.chart.allchart.find(c => c.name === currentName);
                setSelectedProfile(found || response.data.chart.allchart[0]);
  if(response.data.chart.allchart?.length===1){ setDatatoai(response.data.chart.allchart[0].allChartDataString);}
            } else {
                setSelectedProfile(null);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch charts.");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!selectedProfile) return;
        
        const confirmDelete = window.confirm(`Are you sure you want to permanently delete '${selectedProfile.name}'? This action cannot be undone.`);
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            await api.delete("/astro/delete-chart", {
                data: { name: selectedProfile.name }
            });
            // Refresh logic
            await fetchCharts();
        } catch (error) {
            alert(error.response?.data?.message || "Deletion failed. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        fetchCharts();
    }, []);

    // Generic Table for Varga Charts (D1, D4, D8, D9, D10)
    const VargaTable = ({ data, chartType }) => {
        if (!data) return <p className="text-slate-500 italic p-10 text-center">Data not available for this chart.</p>;
        const entries = Object.entries(data);
        const isD1 = chartType === 'd1Chart';

        return (
            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.02]">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                        <tr>
                            <th className="p-5 border-b border-white/5">Planet</th>
                            <th className="p-5 border-b border-white/5">Sign</th>
                            <th className="p-5 border-b border-white/5">House</th>
                            {isD1 && <th className="p-5 border-b border-white/5">Nakshatra</th>}
                            {isD1 && <th className="p-5 border-b border-white/5">Degree</th>}
                            <th className="p-5 border-b border-white/5">Lord</th>
                            <th className="p-5 border-b border-white/5">Retro</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                        {entries.map(([key, item], idx) => (
                            <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                                <td className="p-5 font-bold text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                                    {item.name || item.planet || key}
                                </td>
                                <td className="p-5">{item.current_sign || item.zodiacSign || item.sign || 'N/A'}</td>
                                <td className="p-5 font-mono text-purple-400">{item.house_number || item.houseNumber || item.house || 'N/A'}</td>
                                {isD1 && <td className="p-5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{item.nakshatra || 'N/A'}</td>}
                                {isD1 && (
                                    <td className="p-5 font-mono text-xs text-slate-500">
                                        {item.degree !== undefined ? `${Math.floor(item.degree)}°` : (item.long || item.longitude || 'N/A')}
                                    </td>
                                )}
                                <td className="p-5 text-xs text-slate-400 font-semibold uppercase">{item.zodiacSignLord || item.lord || 'N/A'}</td>
                                <td className="p-5">
                                    <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${item.isRetro === "true" || item.isRetro === true ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                        {item.isRetro === "true" || item.isRetro === true ? 'Yes' : 'No'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const ShadbalaTable = ({ data }) => {
        if (!data) return null;
        return (
            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.02]">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                        <tr>
                            <th className="p-5 border-b border-white/5">Planet</th>
                            <th className="p-5 border-b border-white/5">Shadbala (Pts)</th>
                            <th className="p-5 border-b border-white/5">Rupas</th>
                            <th className="p-5 border-b border-white/5">Strength %</th>
                            <th className="p-5 border-b border-white/5">Ishta</th>
                            <th className="p-5 border-b border-white/5">Kashta</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                        {Object.entries(data).map(([planet, details]) => (
                            <tr key={planet} className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-5 font-bold text-white uppercase tracking-tight">{planet}</td>
                                <td className="p-5 font-mono text-xs">{parseFloat(details.Shadbala).toFixed(2)}</td>
                                <td className="p-5 font-mono text-xs text-purple-400">{parseFloat(details.rupas).toFixed(3)}</td>
                                <td className="p-5 font-mono text-xs font-bold">{details.percentage_strength}%</td>
                                <td className="p-5 font-mono text-xs text-green-400">{parseFloat(details.ishta_phala).toFixed(2)}</td>
                                <td className="p-5 font-mono text-xs text-red-400">{parseFloat(details.kashta_phala).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const DashaTimeline = ({ data }) => {
        if (!data) return null;
        return (
            <div className="space-y-6">
                {Object.entries(data).map(([lord, subPeriods]) => (
                    <div key={lord} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 lg:p-10">
                        <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                            {lord} Mahadasha
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(subPeriods).map(([subLord, times]) => (
                                times.start_time && (
                                    <div key={subLord} className="p-6 rounded-2xl border border-white/5 bg-black/20 group hover:border-purple-500/30 transition-all">
                                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">{subLord} Antardasha</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[11px] text-slate-500">
                                                <span>From</span>
                                                <span className="text-slate-300 font-mono italic">{times.start_time}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-slate-500">
                                                <span>Until</span>
                                                <span className="text-slate-300 font-mono italic">{times.end_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const tabs = [
        { id: 'd1Chart', label: 'D1 Chart' },
        { id: 'd4Chart', label: 'D4 Chart' },
        { id: 'd8Chart', label: 'D8 Chart' },
        { id: 'd9Chart', label: 'D9 Chart' },
        { id: 'd10Chart', label: 'D10 Chart' },
        { id: 'shadbala', label: 'Shadbala' },
        { id: 'dashatimings', label: 'Vimshottari Dasha' }
    ];

    return (
        <div className="min-h-screen bg-[#050508] text-white font-['Outfit']">
            <Navbar />
            
            <div className="max-w-7xl mx-auto p-6 py-12 lg:p-20">
                <div className="mb-16">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent mb-6">Celestial Vault</h1>
                    <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
                        {charts.allchart?.map((profile, i) => (
                            <button 
                                key={i} 
                                onClick={() => {setSelectedProfile(profile);setDatatoai(profile.allChartDataString)}}
                                className={`px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                                    selectedProfile?.name === profile.name 
                                    ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] scale-105' 
                                    : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'
                                }`}
                            >
                                {profile.name}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedProfile && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Profile Header with Delete Button */}
                        <div className="flex justify-between items-center bg-white/[0.02] border-l-4 border-purple-500 p-6 rounded-r-3xl">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">{selectedProfile.name}</h2>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Record</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <button 
                                    onClick={() => navigate('/aianalysis', { state: { datatoai: datatoai } })}
                                    className="px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
                                >
                                    AI Analysis
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Profile'}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-[2rem] border border-white/10 w-fit">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[600px]">
                            {['d1Chart', 'd4Chart', 'd8Chart', 'd9Chart', 'd10Chart'].includes(activeTab) && (
                                <VargaTable data={selectedProfile[activeTab]} chartType={activeTab} />
                            )}
                            {activeTab === 'shadbala' && (
                                <ShadbalaTable data={selectedProfile.shadbala} />
                            )}
                            {activeTab === 'dashatimings' && (
                                <DashaTimeline data={selectedProfile.dashatimings} />
                            )}
                        </div>
                    </div>
                )}
                
                {/* Empty State */}
                {!loading && !selectedProfile && (
                    <div className="text-center py-40 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                        <p className="text-slate-500 text-lg italic">Your vault is empty. Generate a birth profile to get started.</p>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `}} />
        </div>
    );
}

export default Displaycharts;