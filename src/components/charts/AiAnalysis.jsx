import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function AiAnalysis() {
    const location = useLocation();
    const navigate = useNavigate();
    const datatoai = location.state?.datatoai;
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    if (!datatoai) {
        return (
            <div className="min-h-screen bg-[#050508] flex items-center justify-center p-10 font-['Outfit']">
                <div className="text-center p-12 bg-white/2 border border-white/10 rounded-[3rem] backdrop-blur-2xl">
                    <h2 className="text-3xl font-bold text-white mb-4">Cosmic Silence</h2>
                    <p className="text-slate-400 mb-8 max-w-xs mx-auto">The AI needs your birth chart to begin the interpretation. Please select a profile first.</p>
                    <button 
                        onClick={() => navigate('/displaycharts')}
                        className="px-8 py-3 bg-purple-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-purple-500/20"
                    >
                        Return to Vault
                    </button>
                </div>
            </div>
        );
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            // Include today's date so the AI knows the current transit/dasha time
            const today = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            const fullPrompt = `Today's Date & Time: ${today}\nBirth Chart Context: ${datatoai}\n\nUser Question: ${userMsg}\n\nPlease provide an astrological interpretation based on the chart data and today's relative date.`;
            
            const response = await api.post('/astro/get-ai-response', 
                { prompt: fullPrompt }
            );

            setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
            console.log("AI Answer:", response.data.response);
        } catch (error) {
            console.error("AI Fetch Error:", error);
            setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the astral planes. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050508] text-white font-['Outfit'] flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="p-4 md:p-6 border-b border-white/5 backdrop-blur-md bg-black/20 flex justify-between items-center z-10">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Astra AI</h1>
                        <p className="text-[9px] md:text-[10px] text-purple-400 uppercase tracking-widest font-bold">Divine Interpreter</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/displaycharts')}
                    className="text-[9px] md:text-[10px] text-slate-500 hover:text-white uppercase tracking-widest font-bold transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5 sm:bg-transparent sm:p-0 sm:border-0"
                >
                    Close
                </button>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 opacity-60">
                        <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5 italic text-slate-400 text-sm leading-relaxed">
                            "The stars have aligned and your data is ready. Ask me anything about your placements, career, or spiritual path."
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] md:max-w-[70%] p-5 md:p-6 rounded-2xl md:rounded-4xl text-sm md:text-base leading-relaxed shadow-sm transition-all duration-500 ${
                            msg.role === 'user' 
                                ? 'bg-purple-600 text-white rounded-br-none shadow-purple-500/10' 
                                : 'bg-amber-500/5 border border-white/10 text-slate-100 rounded-bl-none backdrop-blur-xl'
                        }`}>
                            {msg.content.split(/#0#0|\*\*/).map((line, i) => {
                                return <p  className="my-2 text-base md:tracking-wider md:text-lg" key={i}>{line}</p>
                            })}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-4xl rounded-bl-none backdrop-blur-xl">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </main>

            {/* Input Area */}
            <footer className="p-4 md:p-10 border-t border-white/5 backdrop-blur-xl bg-black/40">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 md:gap-4">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the universe..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-4 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 p-3.5 md:p-4 rounded-xl md:rounded-2xl transition-all shadow-lg shadow-purple-500/20 active:scale-90 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.3); }
            `}} />
        </div>
    );
}

export default AiAnalysis;