"use client"; // Required for interactivity (clicking buttons)

import { useState } from "react";
import axios from "axios";
import { AlertTriangle, Droplets, Thermometer, Clock, Wind } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Home() {
  // 1. State Variables (Store user inputs & results)
  const [temp, setTemp] = useState(30);
  const [days, setDays] = useState(10);
  const [source, setSource] = useState("Sewage");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 2. Function to Call the Python API
  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        temperature: temp,
        days_stagnant: days,
        source_type: source,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to connect to backend. Is uvicorn running?");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Bio-Kinetic Gas Predictor
          </h1>
          <p className="text-slate-400 mt-2">
            Predict hazardous gas generation in stagnant water using AI
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Input Controls */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Wind className="text-blue-400" /> Simulation Parameters
            </h2>

            {/* Source Selection */}
            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">Water Source Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSource("Sewage")}
                  className={`p-3 rounded-lg border transition-all ${
                    source === "Sewage"
                      ? "bg-purple-900/50 border-purple-500 text-purple-200"
                      : "bg-slate-800 border-transparent hover:bg-slate-700"
                  }`}
                >
                  🤢 Sewage (H₂S)
                </button>
                <button
                  onClick={() => setSource("Rainwater")}
                  className={`p-3 rounded-lg border transition-all ${
                    source === "Rainwater"
                      ? "bg-emerald-900/50 border-emerald-500 text-emerald-200"
                      : "bg-slate-800 border-transparent hover:bg-slate-700"
                  }`}
                >
                  🌧️ Rainwater (CH₄)
                </button>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="flex items-center gap-2 text-slate-300">
                  <Thermometer size={16} /> Temperature
                </label>
                <span className="text-blue-400 font-mono">{temp}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Days Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="flex items-center gap-2 text-slate-300">
                  <Clock size={16} /> Stagnation Duration
                </label>
                <span className="text-blue-400 font-mono">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Simulating..." : "Run Prediction Model"}
            </button>
          </div>

          {/* RIGHT COLUMN: Results Display */}
          <div className="space-y-6">
            
            {/* 1. Result Card */}
            {result ? (
              <div className={`p-6 rounded-2xl border ${
                result.risk_level === "CRITICAL" ? "bg-red-950/30 border-red-500" :
                result.risk_level === "High" ? "bg-orange-950/30 border-orange-500" :
                "bg-emerald-950/30 border-emerald-500"
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-slate-400 text-sm uppercase tracking-wider">Predicted Concentration</h3>
                    <div className="text-5xl font-mono font-bold mt-1">
                      {result.predicted_ppm} <span className="text-lg text-slate-500">ppm</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    result.risk_level === "CRITICAL" ? "bg-red-500 text-white" :
                    result.risk_level === "High" ? "bg-orange-500 text-white" :
                    "bg-emerald-500 text-white"
                  }`}>
                    {result.risk_level} RISK
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <AlertTriangle className={
                    result.risk_level === "CRITICAL" ? "text-red-500" : "text-yellow-500"
                  } />
                  <p className="text-sm text-slate-300">{result.health_advice}</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
                Run the simulation to see results
              </div>
            )}

            {/* 2. Mini Graph (Static Visualization Placeholder) */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm text-slate-400 mb-4">Kinetics Projection (Theoretical)</h3>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: 0, ppm: 0 },
                    { day: days * 0.5, ppm: result ? result.predicted_ppm * 0.6 : 20 },
                    { day: days, ppm: result ? result.predicted_ppm : 40 },
                  ]}>
                    <XAxis dataKey="day" stroke="#475569" fontSize={12} />
                    <YAxis stroke="#475569" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                    <Line type="monotone" dataKey="ppm" stroke="#3b82f6" strokeWidth={3} dot={false} />
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