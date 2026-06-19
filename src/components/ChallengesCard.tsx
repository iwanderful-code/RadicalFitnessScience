import React from "react";
import { 
  Target, 
  Trophy, 
  Sparkles, 
  Play, 
  CheckCircle2 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip 
} from "recharts";
import { useCommando } from "../context/CommandoContext";

export default function ChallengesCard() {
  const { 
    state, 
    setWorkoutLogs, 
    setHabitState, 
    setDietLog, 
    setHistoricalSteps, 
    setHistoricalHabits, 
    setChallengesMonthly, 
    setCustomChallengeDone, 
    setTriggerCelebration, 
    setCelebrationBadge,
    setDashboardPage 
  } = useCommando();

  const { 
    workoutLogs, 
    habitState, 
    dietLog, 
    historicalSteps, 
    historicalHabits, 
    challengesMonthly, 
    customChallengeDone, 
    dashboardPage 
  } = state;

  // Evaluation stats
  const completedWorkoutsVal = workoutLogs.filter(w => w.completed).length;
  const currentStepsVal = habitState.stepsCompleted;
  
  // Steps Streak
  const stepsGoal = 12000;
  const stepsStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const stepsVal = i === 0 ? habitState.stepsCompleted : (historicalSteps[dateKey] ?? 0);
      if (stepsVal >= stepsGoal) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  const countCompletedHabits = () => {
    let count = 0;
    if (habitState.quitSmoking) count++;
    if (habitState.quitAlcohol) count++;
    if (habitState.quitDrugs) count++;
    if (habitState.quitNegativeCompany) count++;
    if (habitState.sleepDiscipline) count++;
    if (habitState.hydrationChecked) count++;
    return count;
  };

  // Habits Streak
  const habitsStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const completedVal = i === 0 ? countCompletedHabits() : (historicalHabits[dateKey] ?? 0);
      if (completedVal >= 5) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  // 1. Aerobic Stamina
  const challenge1Done = completedWorkoutsVal >= 4 && currentStepsVal >= 12000;
  const volProgressPercentage = Math.min(100, Math.round(((Math.min(completedWorkoutsVal, 4) / 4) * 0.5 + (Math.min(currentStepsVal, 12000) / 12000) * 0.5) * 100));

  // 2. High Intensity
  const intenseWorkoutsVal = workoutLogs.filter(w => w.completed && (w.type === "Strength" || w.type === "Conditioning")).length;
  const challenge2Done = intenseWorkoutsVal >= 2;
  const intensityProgressPercentage = Math.min(100, Math.round((Math.min(intenseWorkoutsVal, 2) / 2) * 100));

  // 3. Consistency Streak
  const highestStreakVal = Math.max(stepsStreak, habitsStreak);
  const challenge3Done = highestStreakVal >= 5;
  const streakProgressPercentage = Math.min(100, Math.round((Math.min(highestStreakVal, 5) / 5) * 100));

  // 4. Diet/Glycemic Protocol (FIXED hydration logic to use waterGlasses / glasses instead of ounces)
  const dietPerfect = dietLog.breakfastChecked && dietLog.lunchChecked && dietLog.dinnerChecked;
  const currentHydrationVal = dietLog.waterGlasses; // Fixed
  const challenge4Done = dietPerfect && currentHydrationVal >= 8; // Fixed >= 8 glasses
  const dietMealsScore = dietPerfect ? 1 : 0;
  const dietProgressPercentage = Math.min(100, Math.round((dietMealsScore * 0.5 + (Math.min(currentHydrationVal, 8) / 8) * 0.5) * 100)); // Fixed

  // 5. Habit Compliance
  const completedHabitsCount = countCompletedHabits();
  const challenge5Done = completedHabitsCount >= 4;
  const habitChallengeProgressPercentage = Math.min(100, Math.round((Math.min(completedHabitsCount, 4) / 4) * 100));

  const totalCompleted = [challenge1Done, challenge2Done, challenge3Done, challenge4Done, challenge5Done, customChallengeDone].filter(Boolean).length;

  const handleBoostVolume = () => {
    setWorkoutLogs(prev => {
      const completed = prev.map(w => ({ ...w, completed: true }));
      while (completed.length < 4) {
        completed.push({
          id: `w-boosted-${Date.now()}-${completed.length}`,
          date: new Date().toISOString().split("T")[0],
          type: completed.length % 2 === 0 ? "Strength" : "Zone 2",
          name: `Tactical Force Workout ${completed.length + 1}`,
          completed: true
        });
      }
      return completed;
    });
    setHabitState({ ...habitState, stepsCompleted: Math.max(habitState.stepsCompleted, 12500) });
    setCelebrationBadge("VOLUME COLOSSUS");
    setTriggerCelebration(true);
  };

  const handleBoostIntensity = () => {
    setWorkoutLogs(prev => {
      const list = [...prev];
      const existingIntense = list.filter(w => w.completed && (w.type === "Strength" || w.type === "Conditioning"));
      const needed = 2 - existingIntense.length;
      for (let k = 0; k < needed; k++) {
        list.push({
          id: `w-intense-boosted-${Date.now()}-${k}`,
          date: new Date().toISOString().split("T")[0],
          type: k % 2 === 0 ? "Strength" : "Conditioning",
          name: `Intensity Drill Session-${k + 1}`,
          completed: true
        });
      }
      return list.map(w => (w.type === "Strength" || w.type === "Conditioning" ? { ...w, completed: true } : w));
    });
    setCelebrationBadge("ZONE 5 OVERLORD");
    setTriggerCelebration(true);
  };

  const handleBoostStreak = () => {
    const datesToBackfill = Array.from({ length: 5 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    const newHistSteps = { ...historicalSteps };
    const newHistHabits = { ...historicalHabits };
    datesToBackfill.forEach(dateStr => {
      newHistSteps[dateStr as any] = 12500;
      newHistHabits[dateStr as any] = 5;
    });
    setHistoricalSteps(newHistSteps as any);
    setHistoricalHabits(newHistHabits as any);
    setHabitState({ ...habitState, stepsCompleted: 12500 });
    setCelebrationBadge("CHRONO CHAMPION");
    setTriggerCelebration(true);
  };

  const handleBoostDiet = () => {
    setDietLog({
      ...dietLog,
      breakfastChecked: true,
      lunchChecked: true,
      dinnerChecked: true,
      waterGlasses: 8 // Fixed to 8 glasses
    });
    setCelebrationBadge("FUEL SENTINEL");
    setTriggerCelebration(true);
  };

  const handleBoostHabits = () => {
    setHabitState({
      ...habitState,
      quitSmoking: true,
      quitAlcohol: true,
      quitNegativeCompany: true,
      sleepDiscipline: true,
      hydrationChecked: true
    });
    setCelebrationBadge("IRON MIND GUARD");
    setTriggerCelebration(true);
  };

  const trendData = [
    ...challengesMonthly,
    { month: "Jun 2026 *", completedCount: totalCompleted }
  ].reduce((acc: any[], item: any) => {
    const prevSum = acc.length > 0 ? acc[acc.length - 1].accumulated : 0;
    acc.push({
      name: item.month,
      completed: item.completedCount,
      accumulated: prevSum + item.completedCount
    });
    return acc;
  }, []);

  return (
    <section 
      id="radical-goal-challenges" 
      className={`lg:col-span-3 bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF5F15]/20 transition-all duration-300 ${
        dashboardPage === "challenges" ? "border-[#FF5F15]/30 shadow-[0_0_40px_rgba(255,95,21,0.08)]" : ""
      }`}
      aria-label="Challenges station"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5F15]/3 rounded-full filter blur-[60px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded bg-zinc-900 border border-white/15 flex items-center justify-center text-[#FF5F15] shadow-[0_0_15px_rgba(255,95,21,0.1)]">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg uppercase tracking-tight text-white flex items-center gap-1.5 flex-wrap">
              Radical Goal Challenges Station
              <span className="text-[10px] bg-[#FF5F15]/10 text-[#FF5F15] px-2 py-0.5 rounded border border-[#FF5F15]/20 font-mono uppercase tracking-widest font-extrabold">
                {dashboardPage === "challenges" ? "PAGE ACTIVE" : "TACTICAL MILESTONES"}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Multi-system operational challenges designed to test metabolic threshold, volume consistency, and dietary discipline. Complete each challenge to trigger system-certified badges.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3 bg-zinc-950/80 border border-white/5 rounded-xl px-4 py-2">
            <div className="text-right">
              <span className="text-[8px] font-mono text-zinc-550 block font-extrabold">GLOBAL STATUS INDEX</span>
              <span className="text-xs font-black font-mono text-emerald-400 uppercase tracking-wider block">
                {totalCompleted} / 6 COMPLETED
              </span>
            </div>
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              totalCompleted === 6 
                ? "bg-[#FF5F15]/10 border-[#FF5F15] text-[#FF5F15] animate-bounce" 
                : "bg-zinc-900 border-white/10 text-zinc-550"
            }`}>
              <Trophy className="w-4.5 h-4.5" />
            </div>
          </div>

          {dashboardPage === "overview" ? (
            <button
              onClick={() => setDashboardPage("challenges")}
              className="bg-[#FF5F15]/10 hover:bg-[#FF5F15]/20 text-[#FF5F15] border border-[#FF5F15]/15 px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0 whitespace-nowrap"
            >
              Open Page →
            </button>
          ) : (
            <button
              onClick={() => setDashboardPage("overview")}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0 whitespace-nowrap"
            >
              ← Overview
            </button>
          )}
        </div>
      </div>

      {/* Challenges list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        
        {/* Challenge 1 */}
        <div className={`p-4 rounded-xl border ${challenge1Done ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 bg-zinc-950/30"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Aerobic Stamina</span>
            {challenge1Done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Mito-Stamina Builder</h4>
          <p className="text-xs text-zinc-450 mb-3">Execute 4 schedule workouts &amp; log over 12,000 steps.</p>
          <div className="flex items-center justify-between gap-3">
            <div className="h-1.5 bg-zinc-900 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-[#FF5F15]" style={{ width: `${volProgressPercentage}%` }} />
            </div>
            {!challenge1Done && (
              <button onClick={handleBoostVolume} className="px-2 py-1 bg-zinc-900 hover:bg-[#FF5F15] hover:text-[#0A0A0A] text-[9px] font-mono rounded text-zinc-400 transition-colors uppercase font-bold cursor-pointer">
                Boost
              </button>
            )}
          </div>
        </div>

        {/* Challenge 2 */}
        <div className={`p-4 rounded-xl border ${challenge2Done ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 bg-zinc-950/30"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">High Intensity</span>
            {challenge2Done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Zone 5 Overload</h4>
          <p className="text-xs text-zinc-455 mb-3">Sustain mechanical tension overload with 2 intense exercises.</p>
          <div className="flex items-center justify-between gap-3">
            <div className="h-1.5 bg-zinc-900 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-[#FF5F15]" style={{ width: `${intensityProgressPercentage}%` }} />
            </div>
            {!challenge2Done && (
              <button onClick={handleBoostIntensity} className="px-2 py-1 bg-zinc-900 hover:bg-[#FF5F15] hover:text-[#0A0A0A] text-[9px] font-mono rounded text-zinc-400 transition-colors uppercase font-bold cursor-pointer">
                Boost
              </button>
            )}
          </div>
        </div>

        {/* Challenge 3 */}
        <div className={`p-4 rounded-xl border ${challenge3Done ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 bg-zinc-950/30"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Consistency Streak</span>
            {challenge3Done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Weekly Momentum</h4>
          <p className="text-xs text-zinc-455 mb-3">Lock consecutive disciplines: maintain a 5-day habit/steps streak.</p>
          <div className="flex items-center justify-between gap-3">
            <div className="h-1.5 bg-zinc-900 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-[#FF5F15]" style={{ width: `${streakProgressPercentage}%` }} />
            </div>
            {!challenge3Done && (
              <button onClick={handleBoostStreak} className="px-2 py-1 bg-zinc-900 hover:bg-[#FF5F15] hover:text-[#0A0A0A] text-[9px] font-mono rounded text-zinc-400 transition-colors uppercase font-bold cursor-pointer">
                Boost
              </button>
            )}
          </div>
        </div>

        {/* Challenge 4 */}
        <div className={`p-4 rounded-xl border ${challenge4Done ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 bg-zinc-950/30"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Dietary Control</span>
            {challenge4Done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Fuel Sentinel</h4>
          <p className="text-xs text-zinc-455 mb-3">100% macro compliance &amp; drink 8 glasses of hydration water.</p>
          <div className="flex items-center justify-between gap-3">
            <div className="h-1.5 bg-zinc-900 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-[#FF5F15]" style={{ width: `${dietProgressPercentage}%` }} />
            </div>
            {!challenge4Done && (
              <button onClick={handleBoostDiet} className="px-2 py-1 bg-zinc-900 hover:bg-[#FF5F15] hover:text-[#0A0A0A] text-[9px] font-mono rounded text-zinc-400 transition-colors uppercase font-bold cursor-pointer">
                Boost
              </button>
            )}
          </div>
        </div>

        {/* Challenge 5 */}
        <div className={`p-4 rounded-xl border ${challenge5Done ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 bg-zinc-950/30"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Habit Compliance</span>
            {challenge5Done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Iron Mind Guard</h4>
          <p className="text-xs text-zinc-455 mb-3">Zero smoking/alcohol/negative company &amp; 8h sleep check-in.</p>
          <div className="flex items-center justify-between gap-3">
            <div className="h-1.5 bg-zinc-900 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-[#FF5F15]" style={{ width: `${habitChallengeProgressPercentage}%` }} />
            </div>
            {!challenge5Done && (
              <button onClick={handleBoostHabits} className="px-2 py-1 bg-zinc-900 hover:bg-[#FF5F15] hover:text-[#0A0A0A] text-[9px] font-mono rounded text-zinc-400 transition-colors uppercase font-bold cursor-pointer">
                Boost
              </button>
            )}
          </div>
        </div>

        {/* Custom challenge */}
        <div className={`p-4 rounded-xl border ${customChallengeDone ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-white/5 bg-zinc-950/30"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Custom Challenge</span>
            {customChallengeDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Direct Operational Request</h4>
          <p className="text-xs text-zinc-455 mb-3">Complete your personalized metric challenge listed in the plan.</p>
          <div className="flex items-center justify-end">
            <button 
              onClick={() => setCustomChallengeDone(!customChallengeDone)}
              className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase font-black transition-colors cursor-pointer ${
                customChallengeDone 
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border border-white/5"
              }`}
            >
              {customChallengeDone ? "Completed" : "Mark Done"}
            </button>
          </div>
        </div>

      </div>

      {/* Recharts Monthly Progress chart */}
      <div className="bg-zinc-950/60 p-4 border border-white/5 rounded-2xl relative">
        <div className="absolute top-2 right-3 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF5F15] animate-pulse" />
          <span className="text-[8px] font-mono text-[#FF5F15] uppercase tracking-widest font-black">CUMULATIVE TELEMETRY LIVE</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
            <span className="inline-block w-3 h-1.5 rounded-sm bg-[#FF5F15]" />
            <span className="text-zinc-550 uppercase tracking-wider font-extrabold">Accumulated Milestone Index</span>
            <span className="inline-block w-3 h-1.5 rounded-sm bg-blue-500 ml-4" />
            <span className="text-zinc-550 uppercase tracking-wider font-extrabold">Individual Period Delta</span>
          </div>
        </div>

        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="glowAccumulated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5F15" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF5F15" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="periodDelta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#4b5563" 
                fontSize={9}
                tickLine={false}
                axisLine={false}
                dy={10}
                fontFamily="JetBrains Mono, monospace"
              />
              <YAxis 
                stroke="#4b5563" 
                fontSize={9}
                tickLine={false}
                axisLine={false}
                fontFamily="JetBrains Mono, monospace"
              />
              <RechartsTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0c0c0c] border border-white/10 p-3 rounded-lg shadow-black/80 shadow-2xl font-mono text-[10px]">
                        <p className="font-extrabold text-[#FF5F15] uppercase tracking-wider mb-1.5 border-b border-white/5 pb-1">
                          {payload[0].payload.name}
                        </p>
                        <div className="space-y-1 text-zinc-300">
                          <div className="flex justify-between gap-6">
                            <span>Cumulative Milestones:</span>
                            <span className="text-white font-black text-xs font-semibold">
                              {payload[0].payload.accumulated} locked
                            </span>
                          </div>
                          <div className="flex justify-between gap-6">
                            <span>Monthly Complete:</span>
                            <span className="text-blue-400 font-bold">
                              +{payload[0].payload.completed}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="accumulated"
                stroke="#FF5F15"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#glowAccumulated)"
                dot={{ r: 4, stroke: "#FF5F15", strokeWidth: 2, fill: "#0A0A0A" }}
                activeDot={{ r: 6, stroke: "#FF5F15", strokeWidth: 2, fill: "#FF5F15" }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#periodDelta)"
                dot={{ r: 3, stroke: "#1e40af", strokeWidth: 1.5, fill: "#0A0A0A" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="border-t border-white/5 pt-3 mt-1 flex justify-between items-center text-[9px] font-mono text-zinc-500">
          <span>* Dynamic state synced directly with active tracker widgets.</span>
          <span className="text-zinc-600">COM-CH-T1 // LEVEL 5 SECURITY RULE</span>
        </div>
      </div>

    </section>
  );
}
