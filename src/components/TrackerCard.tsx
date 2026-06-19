import React, { useState } from "react";
import { 
  TrendingUp, 
  Share2, 
  X 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line 
} from "recharts";
import { useCommando } from "../context/CommandoContext";
import { BiometricLog } from "../types";

export default function TrackerCard() {
  const { 
    state, 
    setBiometricLogs, 
    setIsShareModalOpen, 
    setDashboardPage 
  } = useCommando();

  const { 
    profile, 
    biometricLogs, 
    targetWeight, 
    dashboardPage 
  } = state;

  const [newLogWeight, setNewLogWeight] = useState<string>("");
  const [newLogWaist, setNewLogWaist] = useState<string>("");
  const [newLogHip, setNewLogHip] = useState<string>("");
  const [newLogDate, setNewLogDate] = useState<string>(() => new Date().toISOString().split("T")[0]);

  const baseWeight = profile ? profile.weight : 80;
  const currentWeight = biometricLogs.length > 0 ? biometricLogs[biometricLogs.length - 1].weight : baseWeight;

  const handleAddBiometricLog = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newLogWeight);
    const wa = parseFloat(newLogWaist);
    const h = parseFloat(newLogHip);
    
    if (isNaN(w) || isNaN(wa) || isNaN(h)) {
      alert("Please enter valid numeric values for weight, waist, and hip size.");
      return;
    }

    const existingIdx = biometricLogs.findIndex(log => log.date === newLogDate);
    if (existingIdx >= 0) {
      if (!window.confirm(`A biometric entry already exists for ${newLogDate}. Overwrite existing stats?`)) return;
      setBiometricLogs(prev => {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          weight: w,
          waist: wa,
          hip: h
        };
        return next.sort((a, b) => a.date.localeCompare(b.date));
      });
    } else {
      const newEntry: BiometricLog = {
        id: `bio-${Date.now()}`,
        date: newLogDate,
        weight: w,
        waist: wa,
        hip: h
      };
      setBiometricLogs([...biometricLogs, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
    }

    setNewLogWeight("");
    setNewLogWaist("");
    setNewLogHip("");
  };

  const handleDeleteBiometricLog = (id: string) => {
    setBiometricLogs(biometricLogs.filter(log => log.id !== id));
  };

  // Recomp calculations
  const startingWeight = biometricLogs.length > 0 ? biometricLogs[0].weight : baseWeight;
  const recompProgress = (() => {
    if (Math.abs(startingWeight - targetWeight) < 0.1) return 100;
    const totalDist = Math.abs(startingWeight - targetWeight);
    const curDist = Math.abs(currentWeight - targetWeight);
    if (currentWeight === targetWeight) return 100;
    if (curDist >= totalDist) return 0;
    return Math.round(((totalDist - curDist) / totalDist) * 100);
  })();

  const weightRemaining = currentWeight - targetWeight;
  const circumferenceRatio = 2 * Math.PI * 40; // R=40 inside ring SVG

  const isTrackerPage = dashboardPage === "tracker";

  return (
    <section 
      id="biometric-transformation-centre" 
      className={`bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF5F15]/20 transition-all duration-300 ${
        isTrackerPage ? "lg:col-span-3 border-[#FF5F15]/30 shadow-[0_0_40px_rgba(255,95,21,0.08)]" : ""
      }`}
      aria-label="Biometric transformation tracking"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5F15]/3 rounded-full filter blur-[60px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded bg-zinc-900 border border-white/15 flex items-center justify-center text-[#FF5F15] shadow-[0_0_15px_rgba(255,95,21,0.1)]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg uppercase tracking-tight text-white flex items-center gap-1.5 flex-wrap">
              Weekly Recomp &amp; Biometrics Tracker
              <span className="text-[10px] bg-[#FF5F15]/10 text-[#FF5F15] px-2 py-0.5 rounded border border-[#FF5F15]/20 font-mono uppercase tracking-widest font-extrabold">
                {isTrackerPage ? "PAGE ACTIVE" : "TRANSFORMATION ENGINE"}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Enter weekly measurements to visualize long-term body composition trends. Pure civilian biophysics: watch the lines intersect.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#FF5F15]/10 hover:bg-[#FF5F15] hover:text-black border border-[#FF5F15]/30 text-[#FF5F15] font-black text-xs px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer text-center"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Passport
          </button>

          {dashboardPage === "overview" ? (
            <button
              type="button"
              onClick={() => setDashboardPage("tracker")}
              className="w-full sm:w-auto bg-[#FF5F15]/10 hover:bg-[#FF5F15]/40 text-[#FF5F15] border border-[#FF5F15]/15 px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0 text-center"
            >
              Open Page →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDashboardPage("overview")}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0 text-center"
            >
              ← Overview
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
        
        {/* Chart area */}
        <div className="lg:col-span-2 xl:col-span-6 bg-zinc-950/70 border border-white/5 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <span className="text-[10px] tracking-wider uppercase font-mono text-zinc-400 font-bold">
              📈 Physical Progression Curve
            </span>
            
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F15]" />
                <span className="text-zinc-300 font-bold">Weight (kg)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                <span className="text-zinc-300 font-bold">Waist (cm)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                <span className="text-zinc-300 font-bold">Hip (cm)</span>
              </div>
            </div>
          </div>

          <div className="h-[260px] w-full">
            {biometricLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-xs">
                ⚠️ No logs registered. Enter your first weekly check-in specs adjacent!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={biometricLogs} 
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(dateStr) => {
                      const parts = dateStr.split("-");
                      return parts.length === 3 ? `${parts[1]}/${parts[2]}` : dateStr;
                    }}
                    tick={{ fill: '#71717a', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#4b5563"
                    fontSize={9}
                    fontFamily="JetBrains Mono, monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#FF5F15" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="waist" stroke="#06B6D4" strokeWidth={1.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="hip" stroke="#A855F7" strokeWidth={1.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Weight Goal Progress widget */}
        <div className="lg:col-span-1 xl:col-span-3 bg-zinc-950/70 border border-white/5 rounded-xl p-4 flex flex-col justify-between items-center text-center">
          <span className="text-[10px] tracking-wider uppercase font-mono text-zinc-500 block font-bold self-start mb-2">
            🎯 Target Weight Quota
          </span>

          <div className="flex-1 flex flex-col justify-center items-center py-4 w-full">
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="56" cy="56" r="40" 
                  stroke="#FF5F15" strokeWidth="6" fill="transparent" 
                  strokeDasharray={circumferenceRatio}
                  strokeDashoffset={circumferenceRatio * (1 - recompProgress / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black font-mono text-zinc-100">{recompProgress}%</span>
                <span className="text-[7px] font-mono text-zinc-550 text-zinc-400 uppercase tracking-widest font-black leading-none mt-0.5">COMPLETE</span>
              </div>
            </div>

            <div className="text-center min-h-[36px] flex flex-col justify-center items-center">
              <span className="text-[8px] font-mono text-zinc-500 uppercase block font-bold leading-none mb-1">
                RECOMP GAIN/LOSS DISTANCE
              </span>
              <span className="text-[11px] font-black font-mono text-white tracking-tight uppercase block leading-tight">
                {Math.abs(weightRemaining) < 0.05 ? "⭐ Target Met!" : `${Math.abs(weightRemaining).toFixed(1)} kg remaining`}
              </span>
              <span className="text-[8px] font-mono text-zinc-400 block tracking-tight leading-none mt-0.5">
                {Math.abs(weightRemaining) < 0.05 ? "Ideal composition!" : weightRemaining > 0 ? "(to lose/burn)" : "(to gain/bulk)"}
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-2 flex items-center justify-center w-full">
            <span className="text-[8px] text-[#FF5F15]/80 leading-normal font-mono uppercase tracking-wider text-center">
              🎯 TARGET WEIGHT: {targetWeight} KG
            </span>
          </div>
        </div>

        {/* Check-In form with correct tag wrapping */}
        <form onSubmit={handleAddBiometricLog} className="lg:col-span-1 xl:col-span-3 bg-zinc-950/80 border border-white/5 rounded-xl p-4 flex flex-col justify-between h-full space-y-4">
          <div>
            <span className="text-[10px] tracking-wider uppercase font-mono text-zinc-500 block mb-2.5 font-bold">
              ⚡ Check-In Parameters
            </span>
            
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-mono text-zinc-400 uppercase font-black block mb-1">Check-in Date</label>
                <input 
                  type="date"
                  required
                  value={newLogDate}
                  onChange={(e) => setNewLogDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-[#FF5F15]"
                />
              </div>
              
              <div className="space-y-2.5">
                <div>
                  <label className="text-[9px] font-mono text-zinc-400 uppercase font-black block mb-1">Weight (kg)</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 79.5"
                    value={newLogWeight}
                    onChange={(e) => setNewLogWeight(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-[#FF5F15]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-400 uppercase font-black block mb-1">Waist (cm)</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 86.0"
                    value={newLogWaist}
                    onChange={(e) => setNewLogWaist(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-[#FF5F15]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-400 uppercase font-black block mb-1">Hip (cm)</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 99.0"
                    value={newLogHip}
                    onChange={(e) => setNewLogHip(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-[#FF5F15]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5F15] hover:bg-orange-600 text-black font-black text-xs py-2.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Secure Recomp Log
          </button>
        </form>
      </div>

      {/* Historic Logs checklists */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <span className="text-[10px] tracking-wider uppercase font-mono text-zinc-500 block mb-2 font-bold">
          📋 Historic Transformation Log checklist
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 max-h-[145px] overflow-y-auto pr-1">
          {biometricLogs.map((log) => (
            <div 
              key={log.id}
              className="bg-zinc-900/40 border border-white/5 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono group/log hover:border-zinc-700 hover:bg-zinc-900/80 transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 font-bold block">{log.date}</span>
                <div className="flex gap-2.5 text-zinc-350">
                  <span className="text-[#FF5F15] font-bold">{log.weight}kg</span>
                  <span className="text-[#06B6D4]">W: {log.waist}cm</span>
                  <span className="text-[#A855F7]">H: {log.hip}cm</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => handleDeleteBiometricLog(log.id)}
                className="text-zinc-500 hover:text-red-400 p-1 transition-all cursor-pointer opacity-100 xl:opacity-0 group-hover/log:opacity-100 focus:opacity-100"
                title="Delete Biometric Entry"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
