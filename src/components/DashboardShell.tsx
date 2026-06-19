import React from "react";
import { 
  Crown, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Gauge, 
  Dumbbell, 
  Apple, 
  Brain, 
  Trophy, 
  Activity, 
  MessageSquare, 
  Award 
} from "lucide-react";
import { useCommando } from "../context/CommandoContext";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const { 
    state, 
    setDashboardPage, 
    setActiveTab, 
    setIsPaywallOpen, 
    resetAllData 
  } = useCommando();

  const { 
    profile, 
    plan, 
    userTier, 
    billingCycle, 
    dashboardPage, 
    workoutLogs, 
    dietLog, 
    habitState, 
    biometricLogs 
  } = state;

  if (!profile || !plan) return null;

  // Compute stats for nav badges
  const completedWorkouts = workoutLogs.filter(w => w.completed).length;
  const loggedMealsCount = [dietLog.breakfastChecked, dietLog.lunchChecked, dietLog.dinnerChecked].filter(Boolean).length;
  const checkedHabitsCount = Object.entries(habitState).filter(([key, val]) => typeof val === "boolean" && val === true).length;
  
  // Calculate completed challenges (mock count matching logic in App.tsx)
  const completedChallengesCount = [
    completedWorkouts >= 4 && habitState.stepsCompleted >= 12000,
    completedWorkouts >= 5 && loggedMealsCount >= 3,
    habitState.sleepDiscipline && habitState.hydrationChecked && [habitState.quitAlcohol, habitState.quitDrugs, habitState.quitSmoking].filter(Boolean).length >= 3,
    loggedMealsCount === 3,
    checkedHabitsCount >= 4
  ].filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Dashboard Subheader Details */}
      <section className="bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden" aria-label="Command dashboard metadata">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5F15]/5 rounded-full filter blur-2xl pointer-events-none" />
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setIsPaywallOpen(true)}
              className="bg-[#FF5F15]/10 hover:bg-[#FF5F15]/20 text-[#FF5F15] border border-[#FF5F15]/30 text-[10px] px-3 py-0.5 rounded-full font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
              title="Manage Subscription Tiers"
            >
              <Crown className="w-3 h-3 text-[#FF5F15]" />
              TIER: {userTier.toUpperCase()} ({billingCycle.toUpperCase()})
            </button>
            {userTier === "Free" ? (
              <button
                onClick={() => setIsPaywallOpen(true)}
                className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/40 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                aria-label="Upgrade current tier"
              >
                <Zap className="w-2.5 h-2.5 text-amber-400" />
                Upgrade Tiers
              </button>
            ) : (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                PRO ACTIVE
              </span>
            )}
            <span className="bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] px-3 py-0.5 rounded-full font-mono uppercase">
              Age: {profile.age} yrs
            </span>
            <span className="bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] px-3 py-0.5 rounded-full font-mono uppercase">
              Weight: {profile.weight} kg
            </span>
            <span className="bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] px-3 py-0.5 rounded-full font-mono uppercase">
              Stature: {profile.height} cm
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight italic text-white flex items-center">
            Radical Dashboard: {plan.dietPlan.regimenName}
          </h2>
          <p className="text-sm text-zinc-450 max-w-2xl leading-relaxed mt-1">
            Your focus parameter: <span className="text-zinc-200 font-bold font-mono"> &ldquo;{profile.focusGoal}&rdquo;</span>.
            You are in Phase 1: Metabolic Baseline Recomp. Maintain absolute track log synchronization.
          </p>
        </div>

        {/* Recalibrate command triggers */}
        <div className="flex gap-3 self-start md:self-center">
          <button
            onClick={() => setActiveTab("onboarding")}
            className="border border-[#FF5F15] hover:bg-[#FF5F15]/10 text-[#FF5F15] hover:text-white px-5 py-3 rounded-lg text-xs tracking-widest uppercase font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
            aria-label="Recalibrate profile and generate new plan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Recalibrate Profile
          </button>
          <button
            onClick={resetAllData}
            title="Clean all logs and return to landing screen"
            className="border border-red-500/30 hover:bg-red-500/10 text-red-400 px-3.5 py-3 rounded-lg text-xs uppercase font-mono transition-colors cursor-pointer"
            aria-label="Wipe all local app state data"
          >
            Wipe State
          </button>
        </div>
      </section>

      {/* Motivation Prompt Hero */}
      <section className="bg-zinc-950 border-l-4 border-[#FF5F15] p-5 rounded-r-xl shadow-lg flex items-center justify-between space-x-4" aria-label="Motivational quote">
        <div className="flex items-center space-x-3">
          <span className="text-[#FF5F15] text-lg font-black font-mono">🎖️</span>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-zinc-550 uppercase block font-bold">RADICAL TACTICAL FORCE ORDER</span>
            <p className="text-xs md:text-sm italic text-zinc-300 font-serif leading-relaxed">
              &ldquo;{plan.motivationQuote}&rdquo;
            </p>
          </div>
        </div>
        <span className="hidden lg:inline text-[9px] text-[#FF5F15] uppercase tracking-widest font-mono select-none font-extrabold whitespace-nowrap">
          NO MILITARY DRILLED BS ● CIVILIAN SCIENCE ONLY
        </span>
      </section>

      {/* TACTICAL DEPARTMENT NAVIGATION STATION */}
      <nav id="tactical-navigation-station" className="bg-[#0A0A0A]/90 border border-white/10 p-3.5 rounded-2xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" aria-label="Dashboard subpage navigation">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "overview", label: "Overview", icon: Gauge, badge: "Command" },
            { id: "fitness", label: "Fitness", icon: Dumbbell, badge: `${completedWorkouts}/${workoutLogs.length}` },
            { id: "diet", label: "Diet", icon: Apple, badge: `${loggedMealsCount}/3` },
            { id: "habits", label: "Habits", icon: Brain, badge: `${checkedHabitsCount}/6` },
            { id: "challenges", label: "Challenges", icon: Trophy, badge: `${completedChallengesCount}/5` },
            { id: "tracker", label: "Tracker", icon: Activity, badge: biometricLogs.length > 0 ? `${biometricLogs[biometricLogs.length - 1].weight}kg` : "Profile" },
            { id: "coach", label: "AI Coach", icon: MessageSquare, badge: "Coach" },
            { id: "analytics", label: "Analytics", icon: Award, badge: "7-Day" },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = dashboardPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDashboardPage(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-tight relative cursor-pointer font-sans select-none ${
                  isActive 
                    ? "bg-[#FF5F15] text-[#0A0A0A] shadow-[0_0_20px_rgba(255,95,21,0.25)] border border-[#FF5F15]" 
                    : "bg-zinc-950/40 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/5"
                }`}
                aria-label={`Switch to ${tab.label} section`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? "text-[#0A0A0A]" : "text-[#FF5F15]"}`} />
                <span>{tab.label}</span>
                <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded ${
                  isActive 
                    ? "bg-black/25 text-white" 
                    : "bg-zinc-900 text-zinc-500 group-hover:text-[#FF5F15]/40"
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between xl:justify-end gap-3 text-[9px] font-mono text-zinc-550 border-t xl:border-t-0 border-white/10 pt-3 xl:pt-0 xl:pl-4">
          <span className="uppercase tracking-wider">Tactical Network Sync</span>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
            <span>ONLINE</span>
          </div>
        </div>
      </nav>

      {/* Main dashboard viewport grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {children}
      </div>
    </div>
  );
}
