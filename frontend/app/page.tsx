"use client";

import { useState } from "react";
import axios from "axios";
import { AlertTriangle, Thermometer, Clock, Wind, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Home() {
  const [temp, setTemp] = useState(30);
  const [days, setDays] = useState(10);
  const [source, setSource] = useState("Sewage");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://bio-kinetic-gas-predictor.onrender.com/predict", {
        temperature: temp,
        days_stagnant: days,
        source_type: source,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to connect to backend. Is the Render server awake?");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative font-sans text-white py-12 px-4 sm:px-8 overflow-hidden">
      
      {/* BACKGROUND IMAGE & OVERLAY */}
      <div className="fixed inset-0 z-[-1]">
        {/* Dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-slate-950/85 z-10 bg-gradient-to-b from-slate-950/80 to-slate-900/90"></div>
        {/* Custom User Background Image */}
        <img 
          src="data:image/jpeg;base64,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" 
          alt="Abstract Dark Fluid" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="mb-12 text-center animate-fade-in-down">
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md">
            <Activity className="text-blue-400 w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">AI Safety System Online</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
              Bio-Kinetic Gas Predictor
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            Simulate and predict hazardous <span className="text-emerald-400 font-medium">H₂S</span> and <span className="text-blue-400 font-medium">CH₄</span> generation in stagnant water systems using Random Forest models.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Controls (Glassmorphism) */}
          <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all">
            <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 text-slate-100">
              <Wind className="text-blue-400" /> Simulation Parameters
            </h2>

            {/* Source Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-3">Water Source Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSource("Sewage")}
                  className={`py-4 px-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                    source === "Sewage"
                      ? "bg-purple-500/20 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                      : "bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                  }`}
                >
                  <span className="text-xl block mb-1">🤢</span> Sewage (H₂S)
                </button>
                <button
                  onClick={() => setSource("Rainwater")}
                  className={`py-4 px-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                    source === "Rainwater"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                  }`}
                >
                  <span className="text-xl block mb-1">🌧️</span> Rainwater (CH₄)
                </button>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="mb-8 group">
              <div className="flex justify-between mb-3">
                <label className="flex items-center gap-2 text-slate-300 font-medium group-hover:text-blue-400 transition-colors">
                  <Thermometer size={18} /> Temperature
                </label>
                <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-1 rounded-md">{temp}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
              />
            </div>

            {/* Days Slider */}
            <div className="mb-10 group">
              <div className="flex justify-between mb-3">
                <label className="flex items-center gap-2 text-slate-300 font-medium group-hover:text-blue-400 transition-colors">
                  <Clock size={18} /> Stagnation Duration
                </label>
                <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-1 rounded-md">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Activity className="animate-spin" /> Processing AI Model...
                </span>
              ) : "Run Prediction Model"}
            </button>
          </div>

          {/* RIGHT COLUMN: Results Display */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Result Card */}
            {result ? (
              <div className={`p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500 ${
                result.risk_level === "CRITICAL" ? "bg-red-950/40 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" :
                result.risk_level === "High" ? "bg-orange-950/40 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)]" :
                "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-1">Predicted Concentration</h3>
                    <div className="text-6xl font-mono font-black tracking-tighter text-white">
                      {result.predicted_ppm} <span className="text-2xl text-slate-500 font-sans tracking-normal font-medium">ppm</span>
                    </div>
                  </div>
                  <div className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg ${
                    result.risk_level === "CRITICAL" ? "bg-red-500 text-white shadow-red-500/50" :
                    result.risk_level === "High" ? "bg-orange-500 text-white shadow-orange-500/50" :
                    "bg-emerald-500 text-white shadow-emerald-500/50"
                  }`}>
                    {result.risk_level} RISK
                  </div>
                </div>

                <div className="flex items-start sm:items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <div className={`p-3 rounded-full ${
                    result.risk_level === "CRITICAL" ? "bg-red-500/20 text-red-500" : 
                    result.risk_level === "High" ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Safety Recommendation</h4>
                    <p className="text-slate-400 leading-relaxed">{result.health_advice}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xl border-2 border-dashed border-slate-700/50 rounded-3xl text-slate-500">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="text-lg">Awaiting simulation parameters...</p>
              </div>
            )}

            {/* Kinetics Graph */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-slate-300 font-semibold mb-6 flex items-center gap-2">
                <Activity className="text-blue-400" size={18} /> Kinetics Projection (Theoretical)
              </h3>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: 0, ppm: 0 },
                    { day: Math.round(days * 0.3), ppm: result ? result.predicted_ppm * 0.35 : 10 },
                    { day: Math.round(days * 0.6), ppm: result ? result.predicted_ppm * 0.7 : 25 },
                    { day: days, ppm: result ? result.predicted_ppm : 40 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#64748b" fontSize={12} tickMargin={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                      itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="ppm" name="Gas (ppm)" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}