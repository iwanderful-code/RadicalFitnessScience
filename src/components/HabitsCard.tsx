import React from "react";
import { 
  Brain, 
  Footprints 
} from "lucide-react";
import { useCommando } from "../context/CommandoContext";

export default function HabitsCard() {
  const { state, setHabitState, setDashboardPage } = useCommando();
  const { 
    habitState, 
    plan, 
    dashboardPage 
  } = state;

  if (!plan) return null;

  const countCompletedHabits = () => {
    let count = 0;
    if (habitState.quitSmoking) count++;
    if (habitState.quitAlcohol) count++;
    if (habitState.quitDrugs) count++;
    if (habitState.quitNegativeCompany) count++;
    if (habitState.sleepDiscipline) count++;
    if (habitState.hydrationChecked) count++;
    if (habitState.gymCompleted) count++;
    if (habitState.journalingCompleted) count++;
    if (habitState.readingCompleted) count++;
    if (habitState.stretchProtocol) count++;
    if (habitState.restDayObserved) count++;
    if (habitState.saunaTherapy) count++;
    if (habitState.coldShower) count++;
    if (habitState.smallPortions) count++;
    if (habitState.multipleMeals) count++;
    return count;
  };

  const habitsProgress = Math.round((countCompletedHabits() / 15) * 100);
  const stepsGoal = 12000;
  const isHabitsPage = dashboardPage === "habits";

  const toggleHabit = (key: keyof typeof habitState) => {
    if (typeof habitState[key] === "boolean") {
      setHabitState({
        ...habitState,
        [key]: !habitState[key]
      });
    }
  };

  return (
    <section 
      className={`bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-[#FF5F15]/20 transition-all duration-300 ${
        isHabitsPage ? "lg:col-span-3 border-[#FF5F15]/30 shadow-[0_0_40px_rgba(255,95,21,0.08)]" : "lg:col-span-1"
      }`}
      aria-label="Habit discipline tracking"
    >
      <div>
        <div className="flex justify-between items-center border-b border-white/15 pb-4 mb-4">
          <div className="flex-1 flex justify-between items-start">
            <div>
              <span className="text-[#FF5F15] font-mono text-xs font-bold uppercase tracking-widest">03 / BEHAVIORAL MINDSET</span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-white flex items-center gap-1.5 flex-wrap">
                Habit Discipline
                {isHabitsPage && (
                  <span className="text-[9px] font-mono font-black italic bg-[#FF5F15]/15 text-[#FF5F15] px-2 py-0.5 rounded border border-[#FF5F15]/30">
                    PAGE ACTIVE
                  </span>
                )}
              </h3>
            </div>
            {dashboardPage === "overview" ? (
              <button
                onClick={() => setDashboardPage("habits")}
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
            <Brain className="w-5 h-5" />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-zinc-450 mb-1.5">
          <span className="uppercase">Nervous Reset Percentage</span>
          <span className="text-[#FF5F15] font-bold">{habitsProgress}% Steel</span>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden mb-5">
          <div 
            className="h-full bg-[#FF5F15] transition-all duration-500" 
            style={{ width: `${habitsProgress}%` }}
          />
        </div>

        {/* Dynamic Habit items representation based on generated plan info */}
        <div className="space-y-2 mb-4">
          
          {/* Smoking vice toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.quitSmoking 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-red-950/20 border-red-500/20 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🚭</span>
              <div>
                <span className="font-bold font-mono">Excluded Tobacco / Vapes</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Vices Restriction Protocol</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.quitSmoking}
              onChange={() => toggleHabit("quitSmoking")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Alcohol vice toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.quitAlcohol 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-red-950/20 border-red-500/20 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🍺</span>
              <div>
                <span className="font-bold font-mono">Excluded Alcohol Intake</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Liver &amp; Cortisol Recovery</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.quitAlcohol}
              onChange={() => toggleHabit("quitAlcohol")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Negative company vice toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.quitNegativeCompany 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-red-950/20 border-red-500/20 text-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">☢️</span>
              <div>
                <span className="font-bold font-mono">Excluded Toxic Companions</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Mental focus &amp; time reclamation</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.quitNegativeCompany}
              onChange={() => toggleHabit("quitNegativeCompany")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Sleep vice toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.sleepDiscipline 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🛌</span>
              <div>
                <span className="font-bold font-mono">8h Lights-Out Protocol</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Screens banned 1 hour before bed</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.sleepDiscipline}
              onChange={() => toggleHabit("sleepDiscipline")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Gym habit toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.gymCompleted 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">💪</span>
              <div>
                <span className="font-bold font-mono">Gym Session</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Physical mechanical stress loading</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.gymCompleted}
              onChange={() => toggleHabit("gymCompleted")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Journaling habit toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.journalingCompleted 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">✍️</span>
              <div>
                <span className="font-bold font-mono">Mental Journaling</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Stoic logs &amp; focus calibration</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.journalingCompleted}
              onChange={() => toggleHabit("journalingCompleted")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Reading habit toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.readingCompleted 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">📚</span>
              <div>
                <span className="font-bold font-mono">Cognitive Reading</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Focus expansion (minimum 15 mins)</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.readingCompleted}
              onChange={() => toggleHabit("readingCompleted")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Stretch protocol toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.stretchProtocol 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🧘‍♂️</span>
              <div>
                <span className="font-bold font-mono">Stretch Protocols</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Stretch/Mobility (Don't Overtrain, Avoid Injury)</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.stretchProtocol}
              onChange={() => toggleHabit("stretchProtocol")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Rest day toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.restDayObserved 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-550"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🛌</span>
              <div>
                <span className="font-bold font-mono">Rest Days Observed</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Active recovery &amp; CNS resetting</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.restDayObserved}
              onChange={() => toggleHabit("restDayObserved")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Sauna therapy toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.saunaTherapy 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🧖‍♂️</span>
              <div>
                <span className="font-bold font-mono">Sauna Session</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Cardiovascular heat shock proteins release</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.saunaTherapy}
              onChange={() => toggleHabit("saunaTherapy")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Cold shower toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.coldShower 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🥶</span>
              <div>
                <span className="font-bold font-mono">Cold Shower / Ice Bath</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Vagal tone upregulation &amp; anti-inflammation</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.coldShower}
              onChange={() => toggleHabit("coldShower")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Small portions toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.smallPortions 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🍽️</span>
              <div>
                <span className="font-bold font-mono">Small Portion Sizes</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Avoid stomach distension and overeating</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.smallPortions}
              onChange={() => toggleHabit("smallPortions")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>

          {/* Multiple meals toggle */}
          <label 
            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
              habitState.multipleMeals 
                ? "bg-zinc-900 border-[#FF5F15]/20 text-[#FF5F15]" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">🍱</span>
              <div>
                <span className="font-bold font-mono">4 to 6 Small Meals</span>
                <span className="block text-[9px] text-zinc-550 uppercase tracking-tight">Sustained protein synthesis spikes</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={habitState.multipleMeals}
              onChange={() => toggleHabit("multipleMeals")}
              className="accent-[#FF5F15] cursor-pointer scale-105" 
            />
          </label>
        </div>

        {/* Step slider component */}
        <div className="bg-zinc-950/85 border border-white/5 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-450 mb-2">
            <span className="flex items-center gap-1.5"><Footprints className="text-[#FF5F15] w-3.5 h-3.5" /> Step Movement Discipline</span>
            <span className="text-[#FF5F15] font-bold">{habitState.stepsCompleted.toLocaleString()} / {stepsGoal}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={habitState.stepsCompleted}
              onChange={(e) => setHabitState({ ...habitState, stepsCompleted: parseInt(e.target.value) })}
              className="flex-1 h-1 pb-0 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5F15]"
              aria-label="Daily step counter"
            />
            <button 
              onClick={() => setHabitState({ ...habitState, stepsCompleted: habitState.stepsCompleted + 1000 })}
              className="px-2.5 py-1 text-[10px] font-mono border border-zinc-850 hover:border-[#FF5F15] hover:text-[#0A0A0A] hover:bg-[#FF5F15] rounded transition-colors cursor-pointer text-zinc-350"
            >
              +1k Steps
            </button>
          </div>

          <div className="flex justify-between text-[8px] font-mono text-zinc-600 mt-2">
            <span>0 Step</span>
            <span>12k Base</span>
            <span>20k Extreme</span>
          </div>
        </div>

        {/* Habit advice text section */}
        <div className="border-t border-white/5 pt-4">
          <div className="text-[10px] tracking-wider uppercase font-mono text-zinc-550 mb-2 font-bold">Mental Steel Instruction</div>
          <p className="text-[11px] italic font-mono text-[#FF5F15]/95 leading-relaxed">
            &ldquo;{plan.habitsPlan.tips[0] || "Clean associations build clean schedules. Disconnect quickly from those who tolerate low standards."}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
