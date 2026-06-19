import React, { useState } from "react";
import { 
  Award, 
  Play, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useCommando } from "../context/CommandoContext";
import { getWeeklyPerformanceMetrics, renderReportText } from "../utils/helpers";

export default function AnalyticsCard() {
  const { 
    state, 
    setWeeklyReports, 
    setChatMessages, 
    setIsCoachTyping,
    setDashboardPage 
  } = useCommando();

  const { 
    profile, 
    plan, 
    workoutLogs, 
    dietLog, 
    habitState, 
    historicalProgress, 
    historicalSteps, 
    historicalHabits, 
    weeklyReports,
    dashboardPage 
  } = state;

  const [selectedBlockType, setSelectedBlockType] = useState<"current" | "high" | "low">("current");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportLoadingText, setReportLoadingText] = useState("");
  const [activeReportIndex, setActiveReportIndex] = useState<number | null>(null);

  if (!profile || !plan) return null;

  // Determine active metrics depending on block selection
  const currentMetrics = getWeeklyPerformanceMetrics(
    workoutLogs,
    historicalSteps,
    historicalHabits
  );

  const activeMetrics = (() => {
    if (selectedBlockType === "high") {
      return {
        workoutRate: 100,
        avgSteps: 14200,
        totalSteps: 99400,
        avgHabits: 5.8
      };
    } else if (selectedBlockType === "low") {
      return {
        workoutRate: 33,
        avgSteps: 6100,
        totalSteps: 42700,
        avgHabits: 3.1
      };
    }
    return currentMetrics;
  })();

  const generateReport = async () => {
    setReportLoading(true);
    setActiveReportIndex(null);

    const steps = [
      "Initializing metabolic cycle scan...",
      "Gathering biometric telemetry data...",
      "Correlating daily workout completion logs...",
      "Evaluating macronutrient and hydration compliance...",
      "Structuring behavioral habit steel coefficients...",
      "Synthesizing metabolic performance report via AI..."
    ];

    let stepIdx = 0;
    setReportLoadingText(steps[0]);
    const loaderInterval = setInterval(() => {
      if (stepIdx < steps.length - 1) {
        stepIdx++;
        setReportLoadingText(steps[stepIdx]);
      }
    }, 900);

    try {
      // Mock data inputs matching selectedBlockType
      const requestBody = {
        userProfile: profile,
        weeklyWorkouts: selectedBlockType === "current" 
          ? workoutLogs 
          : selectedBlockType === "high"
            ? Array.from({ length: 5 }, (_, i) => ({ completed: true, date: "2026-06", type: "Strength", name: "Sim Strength" }))
            : Array.from({ length: 5 }, (_, i) => ({ completed: i === 0, date: "2026-06", type: "Strength", name: "Sim Strength" })),
        weeklySteps: selectedBlockType === "current"
          ? Array.from({ length: 7 }, (_, i) => ({ count: historicalSteps[i] || 10000 }))
          : selectedBlockType === "high"
            ? Array.from({ length: 7 }, () => ({ count: 14000 }))
            : Array.from({ length: 7 }, () => ({ count: 6000 })),
        weeklyHabits: selectedBlockType === "current"
          ? Array.from({ length: 7 }, (_, i) => ({ count: historicalHabits[i] || 5 }))
          : selectedBlockType === "high"
            ? Array.from({ length: 7 }, () => ({ count: 6 }))
            : Array.from({ length: 7 }, () => ({ count: 3 })),
        dietLog: {
          breakfastChecked: dietLog.breakfastChecked,
          lunchChecked: dietLog.lunchChecked,
          dinnerChecked: dietLog.dinnerChecked,
          waterGlasses: dietLog.waterGlasses
        }
      };

      const res = await fetch("/api/generate-weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      clearInterval(loaderInterval);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Report generation failed");

      setWeeklyReports(prev => [data.text, ...prev]);
      setActiveReportIndex(0);
    } catch (err) {
      console.error(err);
      clearInterval(loaderInterval);
      // Hard fallback report
      const mockReport = `### RADICAL 7-DAY BLOCK PERFORMANCE ANALYSIS
**CYCLE MONITORING INDEX: FALLBACK LOCAL EVALUATION**

---

#### 📊 DETECTED OPERATIONAL METRICS:
* **Fitness Completion Capacity**: **${activeMetrics.workoutRate}%**
* **Aerobic Step Load**: **${activeMetrics.avgSteps.toLocaleString()} daily steps average**
* **Habitual Discipline Index**: **${activeMetrics.avgHabits} / 6 rules checked**
* **Hydration Status**: **${dietLog.waterGlasses} glasses checked**

---

#### 🔱 1. FALLBACK PHYSIOLOGICAL ASSESSMENT
Your average workload index is registered at **${activeMetrics.avgSteps.toLocaleString()} steps** per day. Consistent daily aerobic movement stimulates mitochondrial biogenesis. Keep target pacing locked at 12,000 steps daily.

#### 🥬 2. DIET & NUTRITIONAL LOGS
You are currently on the **${profile.dietPreference}** protocol. Solid macro compliance supports metabolic stability. Maintain hydration targets at 8 glasses of pure water daily.

#### 🎯 AI COACH SUM VERDICT
*Status check complete. Maintain operational discipline. Execute drills list on schedule.*`;

      setWeeklyReports(prev => [mockReport, ...prev]);
      setActiveReportIndex(0);
    } finally {
      setReportLoading(false);
    }
  };

  const sendReportToChat = () => {
    if (activeReportIndex === null || !weeklyReports[activeReportIndex]) return;
    const reportText = weeklyReports[activeReportIndex];
    
    // Add user message triggering AI review in chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `user-report-${Date.now()}`,
        sender: "user",
        text: "Analyze my weekly performance report. Tell me exactly what changes I should make for the next block.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    setDashboardPage("coach");
    setIsCoachTyping(true);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/coach-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { sender: "user", text: `Here is my performance report:\n\n${reportText}\n\nReview it and prescribe specific operational fixes under 120 words.` }
            ],
            userProfile: profile
          })
        });

        const data = await res.json();
        setIsCoachTyping(false);

        setChatMessages(prev => [
          ...prev,
          {
            id: `coach-resp-${Date.now()}`,
            sender: "coach",
            text: data.text || "Report reviewed. Your primary target is to stabilize your conditioning sessions and locking steps streak. Keep lipids clean. Stand firm.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (e) {
        setIsCoachTyping(false);
        setChatMessages(prev => [
          ...prev,
          {
            id: `coach-resp-err-${Date.now()}`,
            sender: "coach",
            text: "Report logged. Stabilize steps parameters and keep macro density clean. Do not negotiate with soft desires.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }, 1500);
  };

  const isAnalyticsPage = dashboardPage === "analytics";

  return (
    <section 
      id="radical-7day-performance-analyzer" 
      className={`bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF5F15]/20 transition-all duration-300 ${
        isAnalyticsPage ? "lg:col-span-3 border-[#FF5F15]/30 shadow-[0_0_40px_rgba(255,95,21,0.08)]" : "lg:col-span-1"
      }`}
      aria-label="Performance report analytics"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5F15]/3 rounded-full filter blur-[60px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 gap-4 w-full">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded bg-zinc-900 border border-white/15 flex items-center justify-center text-[#FF5F15] shadow-[0_0_15px_rgba(255,95,21,0.1)]">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg uppercase tracking-tight text-white flex items-center gap-1.5 flex-wrap">
              7-Day Performance Analyzer Station
              <span className="text-[10px] bg-[#FF5F15]/10 text-[#FF5F15] px-2 py-0.5 rounded border border-[#FF5F15]/20 font-mono uppercase tracking-widest font-extrabold">
                {isAnalyticsPage ? "PAGE ACTIVE" : "CYCLICAL METABOLISM"}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Synthesize your 7-day training data into a structured athletic evaluation with senior coaching prescriptions.
            </p>
          </div>
        </div>

        {dashboardPage === "overview" ? (
          <button
            onClick={() => setDashboardPage("analytics")}
            className="bg-[#FF5F15]/10 hover:bg-[#FF5F15]/20 text-[#FF5F15] border border-[#FF5F15]/15 px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0"
          >
            Open Page →
          </button>
        ) : (
          <button
            onClick={() => setDashboardPage("overview")}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0"
          >
            ← Overview
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-zinc-950/40 p-4 border border-white/5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Select Active 7-Day Block</span>
            <span className="text-[9px] font-mono text-[#FF5F15] font-bold">MODE CHECKLIST</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedBlockType("current")}
              className={`text-[9px] font-sans font-bold py-2 px-1 rounded-md border tracking-wider transition-all cursor-pointer uppercase ${
                selectedBlockType === "current"
                  ? "bg-[#FF5F15] text-[#0A0A0A] border-[#FF5F15]"
                  : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              Active Cycle
            </button>
            <button
              type="button"
              onClick={() => setSelectedBlockType("high")}
              className={`text-[9px] font-sans font-bold py-2 px-1 rounded-md border tracking-wider transition-all cursor-pointer uppercase ${
                selectedBlockType === "high"
                  ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30"
                  : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-[#10B981]/20 hover:text-[#10B981]"
              }`}
            >
              Elite (Sim)
            </button>
            <button
              type="button"
              onClick={() => setSelectedBlockType("low")}
              className={`text-[9px] font-sans font-bold py-2 px-1 rounded-md border tracking-wider transition-all cursor-pointer uppercase ${
                selectedBlockType === "low"
                  ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30"
                  : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-[#EF4444]/20 hover:text-[#EF4444]"
              }`}
            >
              Rest (Sim)
            </button>
          </div>

          {/* Metrics summary list */}
          <div className="space-y-2.5 font-mono text-[10px] mt-2">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-zinc-500 uppercase">Fitness quota completions</span>
              <span className="text-white font-bold">{activeMetrics.workoutRate}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-zinc-500 uppercase">Average daily steps load</span>
              <span className="text-white font-bold">{activeMetrics.avgSteps.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-zinc-500 uppercase">Daily habits check quota</span>
              <span className="text-white font-bold">{activeMetrics.avgHabits} / 6</span>
            </div>
          </div>

          <button
            onClick={generateReport}
            disabled={reportLoading}
            className="w-full bg-[#FF5F15] hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-[#0A0A0A] font-black uppercase text-[10px] tracking-widest py-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer mt-4"
          >
            {reportLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>Generate Weekly Diagnostics</span>
                <Play className="w-3 h-3 fill-current" />
              </>
            )}
          </button>
        </div>

        {/* Right Column - Report view */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-zinc-950/80 border border-white/5 rounded-xl p-5 min-h-[300px]">
          {reportLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 font-mono text-xs">
              <div className="w-8 h-8 rounded-full border-2 border-[#FF5F15] border-t-transparent animate-spin" />
              <span className="text-[#FF5F15] uppercase tracking-widest text-[9px] font-bold animate-pulse">
                {reportLoadingText}
              </span>
            </div>
          ) : activeReportIndex !== null && weeklyReports[activeReportIndex] ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Metabolic Diagnostics Logged</span>
                <button
                  onClick={sendReportToChat}
                  className="bg-[#FF5F15]/10 hover:bg-[#FF5F15]/20 text-[#FF5F15] px-2.5 py-1 border border-[#FF5F15]/30 rounded text-[9px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  Ask Coach to Review
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto pr-1">
                {renderReportText(weeklyReports[activeReportIndex])}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl font-mono text-[10px]">
              <Award className="w-8 h-8 text-zinc-700 mb-3" />
              <span className="text-zinc-500 uppercase tracking-wider">No diagnostic report compiled</span>
              <p className="text-[9px] text-zinc-650 max-w-xs leading-normal mt-1.5">
                Run the 7-day diagnostics generator to compile your fitness, diet, and sleep habits indices into a scientific performance review.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
