import React, { useState } from "react";
import { 
  Dumbbell, 
  Trash2, 
  Plus, 
  Sparkles,
  Flame
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
import { WorkoutLog } from "../types";

export default function FitnessCard() {
  const { state, setWorkoutLogs, setDashboardPage, setHistoricalProgress } = useCommando();
  const { 
    workoutLogs, 
    plan, 
    dashboardPage, 
    historicalProgress 
  } = state;

  const [addingWorkoutName, setAddingWorkoutName] = useState("");
  const [addingWorkoutType, setAddingWorkoutType] = useState<"Zone 2" | "Strength" | "Conditioning">("Zone 2");

  if (!plan) return null;

  const fitnessProgress = workoutLogs.length > 0 
    ? Math.round((workoutLogs.filter(w => w.completed).length / workoutLogs.length) * 100)
    : 0;

  // Generate 7-day trend series data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    const isToday = i === 6;
    const progress = isToday ? fitnessProgress : (historicalProgress[i] ?? 50); // Fallback to historical index index
    
    return {
      dateKey,
      dayLabel,
      dateStr,
      progress,
      isToday
    };
  });

  const toggleWorkout = (id: string) => {
    setWorkoutLogs(workoutLogs.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const deleteWorkout = (id: string) => {
    setWorkoutLogs(workoutLogs.filter(w => w.id !== id));
  };

  const addNewWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingWorkoutName.trim()) return;
    const newW: WorkoutLog = {
      id: `w-custom-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: addingWorkoutType,
      name: addingWorkoutName,
      completed: false
    };
    setWorkoutLogs([...workoutLogs, newW]);
    setAddingWorkoutName("");
  };

  // Workout streak calculation
  const workoutStreak = (() => {
    let streak = 0;
    // Simple check based on consecutive completed workouts or days
    const completed = workoutLogs.filter(w => w.completed).length;
    if (completed >= 3) return 3;
    if (completed >= 1) return 1;
    return 0;
  })();

  const isFitnessPage = dashboardPage === "fitness";

  return (
    <section 
      className={`bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-[#FF5F15]/20 transition-all duration-300 ${
        isFitnessPage ? "lg:col-span-3 border-[#FF5F15]/30 shadow-[0_0_40px_rgba(255,95,21,0.08)]" : "lg:col-span-1"
      }`}
      aria-label="Fitness department tracking"
    >
      <div>
        <div className="flex justify-between items-center border-b border-white/15 pb-4 mb-4">
          <div className="flex-1 flex justify-between items-start">
            <div>
              <span className="text-[#FF5F15] font-mono text-xs font-bold uppercase tracking-widest">01 / BODY COMPONENT</span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-white flex items-center gap-1.5 flex-wrap">
                Fitness Execution
                {isFitnessPage && (
                  <span className="text-[9px] font-mono font-black italic bg-[#FF5F15]/15 text-[#FF5F15] px-2 py-0.5 rounded border border-[#FF5F15]/30">
                    PAGE ACTIVE
                  </span>
                )}
              </h3>
            </div>
            {dashboardPage === "overview" ? (
              <button
                onClick={() => setDashboardPage("fitness")}
                className="text-[10px] font-mono text-zinc-455 hover:text-[#FF5F15] hover:underline cursor-pointer uppercase font-black tracking-wider"
              >
                Maximize Page →
              </button>
            ) : (
              <button
                onClick={() => setDashboardPage("overview")}
                className="text-[10px] font-mono text-[#FF5F15] hover:underline cursor-pointer uppercase font-black tracking-wider"
              >
                ← Return Overview
              </button>
            )}
          </div>
          <div className="w-11 h-11 bg-zinc-900/60 border border-white/10 rounded-full flex items-center justify-center text-[#FF5F15] ml-4 shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-4 bg-zinc-900/40 p-3 rounded-lg border border-white/5 leading-normal">
          <strong>Aerobic &amp; Load:</strong> {plan.fitnessPlan.zone2Desc}
        </p>

        {/* Progress representation */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-1.5">
            <span className="uppercase">Daily Training Quota</span>
            <span className="text-[#FF5F15] font-bold">{fitnessProgress}% Completed</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-[#FF5F15] transition-all duration-500 shadow-[0_0_10px_rgba(255,95,21,0.5)]" 
              style={{ width: `${fitnessProgress}%` }}
            />
          </div>
        </div>

        {/* 7-DAY RECHARTS LINE CHART TREND */}
        <div className="mb-6 bg-zinc-950/70 border border-white/5 rounded-xl p-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase mb-2 font-bold tracking-wider">
            <span>7-Day Fitness Trend</span>
            <span className="text-[#FF5F15]">Live Tracking</span>
          </div>
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 8, right: 8, left: -28, bottom: 0 }}
              >
                <XAxis 
                  dataKey="dayLabel" 
                  tick={{ fill: '#71717a', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tick={{ fill: '#71717a', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#FF5F15" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#FF5F15', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Training Log Checklist */}
        <div className="space-y-3 mb-6">
          <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block font-bold">DAILY CALIBRATED DRILLS LIST:</span>
          {workoutLogs.map((log) => (
            <div 
              key={log.id} 
              className={`p-3 bg-zinc-950/80 border rounded-xl flex items-center justify-between transition-colors ${
                log.completed ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-white/5"
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <input 
                  type="checkbox" 
                  checked={log.completed} 
                  onChange={() => toggleWorkout(log.id)}
                  className="w-4 h-4 accent-emerald-500 border-white/20 rounded bg-zinc-900 cursor-pointer"
                  aria-label={`Mark "${log.name}" as completed`}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono bg-zinc-900 text-zinc-500 border border-white/5 px-1.5 py-0.5 rounded font-bold uppercase mr-2 inline-block">
                    {log.type}
                  </span>
                  <span className={`text-xs block sm:inline truncate ${log.completed ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                    {log.name}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => deleteWorkout(log.id)}
                className="text-zinc-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors ml-2 shrink-0 cursor-pointer"
                aria-label={`Delete workout "${log.name}"`}
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Drill Form */}
        <form onSubmit={addNewWorkout} className="flex gap-2 mb-6">
          <select 
            value={addingWorkoutType} 
            onChange={(e) => setAddingWorkoutType(e.target.value as any)}
            className="bg-zinc-950 border border-white/10 rounded-xl p-2 text-xs font-mono text-zinc-400 focus:outline-none focus:border-[#FF5F15]"
            aria-label="Workout type"
          >
            <option value="Zone 2">Zone 2</option>
            <option value="Strength">Strength</option>
            <option value="Conditioning">Cond.</option>
          </select>
          <input 
            type="text" 
            value={addingWorkoutName} 
            onChange={(e) => setAddingWorkoutName(e.target.value)} 
            placeholder="Add custom operational workout..."
            className="flex-1 bg-zinc-950 border border-white/10 rounded-xl p-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#FF5F15]"
            aria-label="Workout name"
          />
          <button 
            type="submit"
            className="p-2 bg-[#FF5F15] text-[#0A0A0A] hover:bg-orange-600 rounded-xl transition-colors cursor-pointer"
            aria-label="Add custom workout"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        {/* Streaks and Badges */}
        <div className="border-t border-white/5 pt-4">
          <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block font-bold mb-3">EARNED RECOMP ACHIEVEMENT SIGNALS:</span>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 bg-zinc-950 border border-white/5 px-3 py-1.5 rounded-xl text-zinc-400">
              <Flame className={`w-4 h-4 ${workoutStreak >= 1 ? "text-[#FF5F15] animate-pulse" : "opacity-30"}`} />
              <span className="text-[10px] font-mono">STREAK: {workoutStreak} DRILLS</span>
            </div>
            <div className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-xl font-mono text-[10px] ${
              workoutProgressBadge(fitnessProgress)
            }`}>
              <Sparkles className="w-4 h-4" />
              <span className="uppercase">{badgeLabel(fitnessProgress)}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Helpers
function workoutProgressBadge(progress: number): string {
  if (progress === 100) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (progress >= 50) return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
  return "border-white/5 bg-zinc-950 text-zinc-500";
}

function badgeLabel(progress: number): string {
  if (progress === 100) return "Elite Executed (100%)";
  if (progress >= 50) return "Tactical Operational (50%+)";
  return "Recruit Base";
}
