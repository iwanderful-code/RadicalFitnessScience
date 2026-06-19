import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Flame, 
  Activity, 
  Brain, 
  Dumbbell, 
  Apple, 
  ChevronRight, 
  ChevronLeft,
  Gauge, 
  Trophy, 
  Sparkles, 
  Check, 
  Clock, 
  Compass, 
  CircleDollarSign, 
  MessageSquareCode, 
  Waves,
  User,
  Zap,
  TrendingUp,
  Award,
  X
} from "lucide-react";
import { UserProfile, CommandoPlan } from "../types";

interface PlanGeneratorProps {
  onPlanGenerated: (profile: UserProfile, plan: CommandoPlan) => void;
}

export default function PlanGenerator({ onPlanGenerated }: PlanGeneratorProps) {
  // Navigation Step state: 
  // 0: Goals & Calibration Questionnaire (First Step / Home Page view)
  // 1: The 4 Calibration Cards (Body Specs, Nutrition Lab, Habits & Sleep, AI Coach & Tiers)
  // 2: Calibration Engineering (Loading animation)
  const [step, setStep] = useState<number>(0);

  // Active configuration modal inside step 1
  const [activeModal, setActiveModal] = useState<"body" | "nutrition" | "habits" | "tiers" | null>(null);

  // --- Card 1 States (Body Metrics) ---
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(80);
  const [height, setHeight] = useState<number>(180);
  const [waist, setWaist] = useState<number>(88);
  const [hip, setHip] = useState<number>(102);

  // --- Card 2 States (Nutrition Protocols) ---
  const [dietPreference, setDietPreference] = useState<"Carnivore" | "Keto" | "Low-carb" | "Diet cycling">("Keto");
  const [caloriesTarget, setCaloriesTarget] = useState<number>(2200);
  const [proteinTarget, setProteinTarget] = useState<number>(150);
  const [fatsTarget, setFatsTarget] = useState<number>(100);
  const [carbsTarget, setCarbsTarget] = useState<number>(40);

  // --- Card 3 States (Sleep & Daily Habits) ---
  const [sleepHoursTarget, setSleepHoursTarget] = useState<number>(8);
  const [hydrationTarget, setHydrationTarget] = useState<number>(8); // In glasses
  const [stepsTarget, setStepsTarget] = useState<number>(10000);
  const [selectedVices, setSelectedVices] = useState<string[]>([
    "quitSmoking", "quitAlcohol", "quitDrugs"
  ]);

  // --- Step 0 States (Goals & Custom Challenges) ---
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "Rebuild mitochondrial stamina (Zone 2 cardiothoracic engine)",
    "Establish absolute glycemic control (Insulin sensitivity adaptation)"
  ]);
  const [customChallenge, setCustomChallenge] = useState<string>("");
  const [focusGoal, setFocusGoal] = useState<string>("Shred fat & rebuild athletic lung capacity");

  // --- Card 4 States (AI Coach & Paywall Plans) ---
  const [selectedTier, setSelectedTier] = useState<"free" | "spec-ops" | "general">("spec-ops");

  // --- NEW QUESTIONNAIRE STATES (Section 02 & Section 03 parameters) ---
  const [operationalLoad, setOperationalLoad] = useState<string>("Active Operator");
  const [vulnerabilities, setVulnerabilities] = useState<string[]>(["Zero Vulnerabilities Detected"]);
  const [availableHardware, setAvailableHardware] = useState<string>("Full Arsenal Access");
  const [chronoAllocation, setChronoAllocation] = useState<string>("Standard Sortie");
  const [fuelingProtocol, setFuelingProtocol] = useState<string>("Lipolytic Adaptation");
  const [portionSizeMealFrequency, setPortionSizeMealFrequency] = useState<string>("Small portion size & 4-6 meals");
  const [specialDiets, setSpecialDiets] = useState<string>("None");

  // --- Calibration loading ---
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calibrationTexts = [
    "Establishing user metabolic coordinates...",
    "Correlating waist-to-hip ratio cellular lipid distribution...",
    "Calibrating cardiopulmonary training zone (Zone 2 stamina)...",
    "Preloaded protein & fat metabolic baseline parameters...",
    "Seeding non-negotiable mental self-command habits program...",
    "Securing elite coach communication pathways for AI coaching diagnostics...",
    "Spawning personalized challenges with custom client directives...",
    "Calibrations complete. Initiating Radical Protocol dashboard..."
  ];

  const handleAutoCalibrateMacros = () => {
    if (dietPreference === "Carnivore") {
      const proteinG = Math.round((caloriesTarget * 0.40) / 4);
      const fatG = Math.round((caloriesTarget * 0.59) / 9);
      const carbsG = Math.round((caloriesTarget * 0.01) / 4);
      setProteinTarget(proteinG);
      setFatsTarget(fatG);
      setCarbsTarget(carbsG);
    } else if (dietPreference === "Keto") {
      const proteinG = Math.round((caloriesTarget * 0.25) / 4);
      const fatG = Math.round((caloriesTarget * 0.70) / 9);
      const carbsG = Math.round((caloriesTarget * 0.05) / 4);
      setProteinTarget(proteinG);
      setFatsTarget(fatG);
      setCarbsTarget(carbsG);
    } else if (dietPreference === "Low-carb") {
      const proteinG = Math.round((caloriesTarget * 0.35) / 4);
      const fatG = Math.round((caloriesTarget * 0.45) / 9);
      const carbsG = Math.round((caloriesTarget * 0.20) / 4);
      setProteinTarget(proteinG);
      setFatsTarget(fatG);
      setCarbsTarget(carbsG);
    } else {
      const proteinG = Math.round((caloriesTarget * 0.35) / 4);
      const fatG = Math.round((caloriesTarget * 0.35) / 9);
      const carbsG = Math.round((caloriesTarget * 0.30) / 4);
      setProteinTarget(proteinG);
      setFatsTarget(fatG);
      setCarbsTarget(carbsG);
    }
  };

  const toggleVice = (viceKey: string) => {
    setSelectedVices(prev => 
      prev.includes(viceKey) ? prev.filter(v => v !== viceKey) : [...prev, viceKey]
    );
  };

  const toggleGoalPreset = (preset: string) => {
    setSelectedGoals(prev => 
      prev.includes(preset) ? prev.filter(g => g !== preset) : [...prev, preset]
    );
  };

  const toggleVulnerability = (node: string) => {
    setVulnerabilities(prev => {
      if (node === "Zero Vulnerabilities Detected (Full mechanical clearance)") {
        return [node];
      }
      const filtered = prev.filter(v => v !== "Zero Vulnerabilities Detected (Full mechanical clearance)");
      if (filtered.includes(node)) {
        const next = filtered.filter(v => v !== node);
        return next.length === 0 ? ["Zero Vulnerabilities Detected (Full mechanical clearance)"] : next;
      } else {
        return [...filtered, node];
      }
    });
  };

  const handleGenerate = async () => {
    setStep(2);
    setLoadingStep(0);
    setErrorMsg(null);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < calibrationTexts.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 700);

    try {
      const combinedFocus = [
        focusGoal,
        `Custom Challenge: ${customChallenge || "(None)"}`,
        `Tier Level: ${selectedTier.toUpperCase()}`
      ].filter(Boolean).join(" | ");

      const profile: UserProfile = {
        name: name || "Recruit Operator",
        age,
        weight,
        height,
        trainingLevel: "Intermediate",
        dietPreference,
        focusGoal: combinedFocus,
        waist,
        hip,
        caloriesTarget,
        proteinTarget,
        fatsTarget,
        carbsTarget,
        sleepHoursTarget,
        hydrationTarget,
        stepsTarget,
        customChallenge: customChallenge || undefined,
        tier: selectedTier,
        operationalLoad,
        vulnerabilities,
        availableHardware,
        chronoAllocation,
        fuelingProtocol,
        addictions: selectedVices,
        sleepHabits: `${sleepHoursTarget} hours daily`,
        dailyStepCount: stepsTarget,
        portionSizeMealFrequency,
        specialDiets
      };

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fallback) {
          setTimeout(() => {
            clearInterval(stepInterval);
            onPlanGenerated(profile, data.fallback);
          }, 3500);
          return;
        }
        throw new Error(data.error || "Failed to contact Gemini calibration server.");
      }

      setTimeout(() => {
        clearInterval(stepInterval);
        onPlanGenerated(profile, data);
      }, 5600);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "calibration channel disruption occurred.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 relative">
      <AnimatePresence mode="wait">
        
        {/* STEP 0: Goals & Complete Questionnaire (Home Page) */}
        {step === 0 && (
          <motion.div
            key="step0-goals"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#0A0A0A]/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative space-y-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-[#FF5F15] font-mono text-xs font-black">SECTION 01 /</span>
                <span className="text-white font-extrabold text-sm uppercase tracking-wider font-mono">Mission Objectives & Goals</span>
              </div>
              <span className="text-[10px] font-mono bg-zinc-900 border border-white/5 text-[#FF5F15] px-2.5 py-0.5 rounded font-black tracking-widest uppercase">
                RADICAL CORE
              </span>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black text-white uppercase italic tracking-wide">Select Goals & Establish Challenges</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Customize your operational targets and configure a blank challenge that the system AI Coach parses directly to evaluate milestones.
              </p>
            </div>

            {/* Focus Goal Input */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF5F15] block">
                PRIMARY TRANSFORMATION TARGET SPECIFICATION OBJECTIVE
              </label>
              <input
                type="text"
                required
                value={focusGoal}
                onChange={(e) => setFocusGoal(e.target.value)}
                placeholder="e.g. Maximize physical recomp, increase lean tissue fibers, clear evening brain lethargy"
                className="w-full bg-zinc-950/80 border border-white/10 text-sm font-mono text-zinc-350 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#FF5F15] transition-colors"
              />
            </div>

            {/* Preset milestone list */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 block">
                SELECT PRESET TACTICAL MILESTONES (CHOOSE OR ISOLATE)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Rebuild mitochondrial stamina (Zone 2 cardiothoracic engine)",
                  "Establish absolute glycemic control (Insulin sensitivity adaptation)",
                  "Sustain mechanical tension overload (Force production squats complex)",
                  "Integrate non-negotiable step discipline streak indices",
                ].map((preset) => {
                  const yes = selectedGoals.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => toggleGoalPreset(preset)}
                      className={`p-3.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer flex items-start gap-2.5 ${
                        yes
                          ? "bg-[#FF5F15]/10 border-[#FF5F15]/45 text-white"
                          : "bg-zinc-950/40 border-white/5 text-zinc-450 hover:border-white/10"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded mt-0.5 border shrink-0 flex items-center justify-center ${
                        yes ? "bg-[#FF5F15] border-[#FF5F15] text-black" : "border-zinc-700"
                      }`}>
                        {yes && <Check className="w-2.5 h-2.5 stroke-[4.5]" />}
                      </div>
                      <span>{preset}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Challenge specification */}
            <div className="p-5 bg-zinc-950 border border-dashed border-[#FF5F15]/20 rounded-xl space-y-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#FF5F15] animate-bounce shrink-0" />
                <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono">
                  Custom Challenge Specification Blank (Customer Customized Entry)
                </h4>
              </div>
              <textarea
                value={customChallenge}
                onChange={(e) => setCustomChallenge(e.target.value)}
                rows={2}
                placeholder="e.g. Complete 50 kettlebell swings daily, fast from sugar completely, drink 1L lemon electrolyte water before 9 AM, perform 12 strict pull-ups by week-end..."
                className="w-full bg-zinc-950/90 border border-white/15 text-xs font-mono text-[#FF5F15] rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 placeholder-zinc-700 transition-colors leading-relaxed"
              />
            </div>

            {/* SECTION 02: SYSTEM BIOMETRICS & RESOURCE CALIBRATION */}
            <div className="border-t border-white/10 pt-8 space-y-6">
              <div className="flex items-center space-x-2">
                <span className="text-[#FF5F15] font-mono text-xs font-black">SECTION 02 /</span>
                <span className="text-white font-extrabold text-sm uppercase tracking-wider font-mono">System Biometrics & Resource Calibration</span>
              </div>

              {/* 1. Current Operational Load */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF5F15] block">
                  1. CURRENT OPERATIONAL LOAD (BASELINE CAPACITY)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "Deconditioned / Dormant", label: "Deconditioned / Dormant", desc: "Low baseline stamina; system requires a foundational reboot." },
                    { id: "Active Operator", label: "Active Operator", desc: "Moderate capacity; regular mechanical output but lacking optimization." },
                    { id: "Elite / High-Yield", label: "Elite / High-Yield", desc: "High-performance baseline; seeking marginal gains and extreme optimization." }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setOperationalLoad(item.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-full ${
                        operationalLoad === item.id 
                          ? "bg-[#FF5F15]/10 border-[#FF5F15] text-white" 
                          : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase">{item.label}</span>
                      <span className="text-[10px] text-zinc-550 mt-1 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Biomechanical Vulnerabilities */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 block">
                  2. BIOMECHANICAL VULNERABILITIES (STRUCTURAL NODES)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Anterior/Posterior Kinetic Chain Compromise (Lower back / spine vulnerabilities)",
                    "Patellar/Meniscal Strain (Knee-joint structural limitations)",
                    "Rotator Cuff / Glenohumeral Instability (Shoulder mobility / stability constraints)",
                    "Zero Vulnerabilities Detected (Full mechanical clearance)"
                  ].map((node) => {
                    const selected = vulnerabilities.includes(node);
                    return (
                      <button
                        key={node}
                        type="button"
                        onClick={() => toggleVulnerability(node)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer flex items-start gap-2.5 ${
                          selected 
                            ? "bg-[#FF5F15]/10 border-[#FF5F15]/40 text-white" 
                            : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded mt-0.5 border shrink-0 flex items-center justify-center ${
                          selected ? "bg-[#FF5F15] border-[#FF5F15] text-black" : "border-zinc-700"
                        }`}>
                          {selected && <Check className="w-2.5 h-2.5 stroke-[4.5]" />}
                        </div>
                        <span>{node}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Tactical Asset Deployment */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF5F15] block">
                  3. TACTICAL ASSET DEPLOYMENT (AVAILABLE HARDWARE)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "Full Arsenal Access", label: "Full Arsenal Access", desc: "Commercial gym infrastructure, heavy barbells, cable systems, and recovery bays." },
                    { id: "Mechanized Minimalist", label: "Mechanized Minimalist", desc: "Kettlebells, dumbbells, and high-tension resistance bands only." },
                    { id: "Zero-Hardware Protocol", label: "Zero-Hardware Protocol", desc: "Pure bodyweight, calisthenics, and gravity-based mechanical tension." }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAvailableHardware(item.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-full ${
                        availableHardware === item.id 
                          ? "bg-[#FF5F15]/10 border-[#FF5F15] text-white" 
                          : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase">{item.label}</span>
                      <span className="text-[10px] text-zinc-550 mt-1 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Chrono-Allocation */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 block">
                  4. CHRONO-ALLOCATION (OPERATIONAL WINDOW)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "Surgical Strikes", label: "Surgical Strikes", desc: "20–30 minutes daily (High-intensity efficiency)." },
                    { id: "Standard Sortie", label: "Standard Sortie", desc: "45–60 minutes daily (Balanced tension & metabolic work)." },
                    { id: "Extended Campaign", label: "Extended Campaign", desc: "60–90+ minutes daily (Deep volume and engine rebuilding)." }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setChronoAllocation(item.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-full ${
                        chronoAllocation === item.id 
                          ? "bg-[#FF5F15]/10 border-[#FF5F15] text-white" 
                          : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase">{item.label}</span>
                      <span className="text-[10px] text-zinc-550 mt-1 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Bioenergetic Fueling Protocol */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF5F15] block">
                  5. BIOENERGETIC FUELING PROTOCOL
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "Glycogen Manipulation", label: "Glycogen Manipulation", desc: "Strategic carbohydrate cycling built around high-tension deployment." },
                    { id: "Lipolytic Adaptation", label: "Lipolytic Adaptation", desc: "High-fat, ultra-low carbohydrate focus to maximize fat oxidation." },
                    { id: "Aggressive Energy Deficit", label: "Aggressive Energy Deficit", desc: "Strict caloric restriction to force rapid adipose tissue reduction." }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFuelingProtocol(item.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-full ${
                        fuelingProtocol === item.id 
                          ? "bg-[#FF5F15]/10 border-[#FF5F15] text-white" 
                          : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold font-mono uppercase">{item.label}</span>
                      <span className="text-[10px] text-zinc-550 mt-1 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 03: LIFESTYLE BASELINE PARAMETERS */}
            <div className="border-t border-white/10 pt-8 space-y-6">
              <div className="flex items-center space-x-2">
                <span className="text-[#FF5F15] font-mono text-xs font-black">SECTION 03 /</span>
                <span className="text-white font-extrabold text-sm uppercase tracking-wider font-mono">Lifestyle Baselines</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 6. Vices and Addictions */}
                <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF5F15] block">
                    6. SUBSTANCE & HABIT ADDICTIONS (VICES LOCK)
                  </span>
                  <div className="space-y-2">
                    {[
                      { id: "quitSmoking", label: "Nicotine / Tobacco / Vaping" },
                      { id: "quitAlcohol", label: "Alcohol / Drinking Intake" },
                      { id: "quitDrugs", label: "Toxins / Addictive Compounds" },
                      { id: "quitNegativeCompany", label: "Negative Digital Streams / Company" }
                    ].map((vice) => {
                      const active = selectedVices.includes(vice.id);
                      return (
                        <button
                          key={vice.id}
                          type="button"
                          onClick={() => toggleVice(vice.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            active 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                              : "bg-zinc-950/40 border-white/5 text-zinc-400"
                          }`}
                        >
                          <span className="text-xs font-mono">{vice.label}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            active ? "bg-emerald-500 border-emerald-500 text-black" : "border-zinc-700"
                          }`}>
                            {active && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 7. Sleep Habits Slider */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">7. Sleep Habits Target</span>
                      <span className="text-xs font-bold text-[#FF5F15] font-mono">{sleepHoursTarget} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      value={sleepHoursTarget}
                      onChange={(e) => setSleepHoursTarget(parseInt(e.target.value))}
                      className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                    />
                  </div>

                  {/* 8. Steps count target */}
                  <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">8. Current Daily Steps Target</span>
                      <span className="text-xs font-bold text-[#FF5F15] font-mono">{stepsTarget.toLocaleString()} steps</span>
                    </div>
                    <input
                      type="range"
                      min="6000"
                      max="18000"
                      step="1000"
                      value={stepsTarget}
                      onChange={(e) => setStepsTarget(parseInt(e.target.value))}
                      className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 9. Portion Size & Meal Frequency */}
                <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 block">
                    9. PORTION SIZE & MEAL FREQUENCY
                  </span>
                  <input
                    type="text"
                    value={portionSizeMealFrequency}
                    onChange={(e) => setPortionSizeMealFrequency(e.target.value)}
                    placeholder="e.g. Small portion size & 4 to 6 meals daily"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5F15] font-mono"
                  />
                </div>

                {/* 10. Special Diets (Current/Past) */}
                <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF5F15] block">
                    10. SPECIAL DIET REGIMENS (CURRENT OR PAST)
                  </span>
                  <input
                    type="text"
                    value={specialDiets}
                    onChange={(e) => setSpecialDiets(e.target.value)}
                    placeholder="e.g. Keto for 3 months, low-carb cyclical refeeding"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5F15] font-mono"
                  />
                </div>

              </div>
            </div>

            <div className="flex items-center justify-end border-t border-white/10 pt-6 mt-6">
              <button
                onClick={() => setStep(1)}
                disabled={!focusGoal.trim()}
                className="w-full sm:w-auto px-8 py-4 bg-[#FF5F15] hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-[#FF5F15] text-[#0A0A0A] font-black uppercase text-xs tracking-widest rounded-xl shadow-[0_0_15px_rgba(255,95,21,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
              >
                <span>Continue to Calibration Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 1: The 4 Calibration Cards */}
        {step === 1 && (
          <motion.div
            key="step1-cards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#0A0A0A]/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-[#FF5F15] font-mono text-xs font-black">STEP 02/02 /</span>
                <span className="text-white font-extrabold text-sm uppercase tracking-wider font-mono">Calibration Parameters Dashboard</span>
              </div>
              <span className="text-[10px] font-mono bg-zinc-900 border border-white/5 text-zinc-500 px-2 py-0.5 rounded uppercase">
                COORDINATION NETWORK
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-wide">Configure Calibration Details</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Fine-tune your biometrics, custom macros targets, circadian sleep intervals, and coaching options by tapping each card.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* Card 1: Body Metrics */}
              <div 
                onClick={() => setActiveModal("body")}
                className="bg-zinc-950/60 hover:bg-zinc-900/60 border border-white/5 hover:border-[#FF5F15]/30 rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded bg-[#FF5F15]/10 border border-[#FF5F15]/20 flex items-center justify-center text-[#FF5F15]">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-white">01 / Body Composition Specs</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      READY
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono text-zinc-400">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Name:</span>
                      <span className="text-white font-bold">{name || "Recruit Operator"}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Age & Height:</span>
                      <span className="text-white font-bold">{age} yrs / {height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight & WHR:</span>
                      <span className="text-white font-bold">{weight} kg / {Math.round((waist / hip) * 100) / 100}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-zinc-900 group-hover:bg-[#FF5F15] group-hover:text-black text-zinc-300 font-extrabold font-mono text-[9px] uppercase rounded-lg border border-white/5 transition-all tracking-wider">
                  EDIT BIOMETRICS
                </button>
              </div>

              {/* Card 2: Nutrition Targets */}
              <div 
                onClick={() => setActiveModal("nutrition")}
                className="bg-zinc-950/60 hover:bg-zinc-900/60 border border-white/5 hover:border-[#FF5F15]/30 rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded bg-[#FF5F15]/10 border border-[#FF5F15]/20 flex items-center justify-center text-[#FF5F15]">
                        <Apple className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-white">02 / Macronutrients Lab</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      READY
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono text-zinc-400">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Regimen baselines:</span>
                      <span className="text-white font-bold">{dietPreference}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Daily Energy load:</span>
                      <span className="text-white font-bold">{caloriesTarget} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Macros (P/F/C):</span>
                      <span className="text-white font-bold">{proteinTarget}g / {fatsTarget}g / {carbsTarget}g</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-zinc-900 group-hover:bg-[#FF5F15] group-hover:text-black text-zinc-300 font-extrabold font-mono text-[9px] uppercase rounded-lg border border-white/5 transition-all tracking-wider">
                  EDIT FUEL PLAN
                </button>
              </div>

              {/* Card 3: Habits & Sleep */}
              <div 
                onClick={() => setActiveModal("habits")}
                className="bg-zinc-950/60 hover:bg-zinc-900/60 border border-white/5 hover:border-[#FF5F15]/30 rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded bg-[#FF5F15]/10 border border-[#FF5F15]/20 flex items-center justify-center text-[#FF5F15]">
                        <Brain className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-white">03 / Habits & Daily Hygiene</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      READY
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono text-zinc-400">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Sleep Target:</span>
                      <span className="text-white font-bold">{sleepHoursTarget} hours</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Daily Steps / Water:</span>
                      <span className="text-white font-bold">{stepsTarget.toLocaleString()} / {hydrationTarget} gls</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Isolated Vices:</span>
                      <span className="text-emerald-450 font-bold">{selectedVices.length} active locks</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-zinc-900 group-hover:bg-[#FF5F15] group-hover:text-black text-zinc-300 font-extrabold font-mono text-[9px] uppercase rounded-lg border border-white/5 transition-all tracking-wider">
                  EDIT DAILY HYGIENE
                </button>
              </div>

              {/* Card 4: AI Coach & Tiers */}
              <div 
                onClick={() => setActiveModal("tiers")}
                className="bg-zinc-950/60 hover:bg-zinc-900/60 border border-white/5 hover:border-[#FF5F15]/30 rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded bg-[#FF5F15]/10 border border-[#FF5F15]/20 flex items-center justify-center text-[#FF5F15]">
                        <MessageSquareCode className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-white">04 / Coach & Upgrade Gate</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      READY
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono text-zinc-400">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Coaching system:</span>
                      <span className="text-white font-bold">RADICAL AI Online</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Selected Plan Tier:</span>
                      <span className="text-[#FF5F15] font-black uppercase">{selectedTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Core Billing rate:</span>
                      <span className="text-white font-bold">{selectedTier === "free" ? "Free Forever" : selectedTier === "spec-ops" ? "$19/mo" : "$49/mo"}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-zinc-900 group-hover:bg-[#FF5F15] group-hover:text-black text-zinc-300 font-extrabold font-mono text-[9px] uppercase rounded-lg border border-white/5 transition-all tracking-wider">
                  EDIT MEMBERSHIP TIER
                </button>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-5">
              <button
                onClick={() => setStep(0)}
                className="px-5 py-3 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider cursor-pointer flex items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Goals Back</span>
              </button>
              <button
                onClick={handleGenerate}
                className="px-8 py-4 bg-[#FF5F15] hover:bg-orange-600 text-[#0A0A0A] font-black tracking-wider uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(255,95,21,0.25)] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Deploy Protocol Plan</span>
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Loading Calibration System */}
        {step === 2 && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center shadow-2xl flex flex-col items-center justify-center min-h-[480px] overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,21,0.04)_0%,transparent_60%)] pointer-events-none" />
            <div className="relative mb-8 text-center flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-24 h-24 border-2 border-dashed border-[#FF5F15]/30 rounded-full flex items-center justify-center"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-12 h-12 bg-[#FF5F15]/10 border border-[#FF5F15] rounded-full flex items-center justify-center text-[#FF5F15] shadow-[0_0_20px_rgba(255,95,21,0.3)]"
                >
                  <Gauge className="w-6 h-6 animate-pulse text-[#FF5F15]" />
                </motion.div>
              </div>
            </div>

            <h2 className="text-xl font-black tracking-tight text-white mb-4 uppercase font-mono">
              RADICAL Calibration Engine Active
            </h2>

            <div className="w-full max-w-sm bg-zinc-900 border border-white/5 h-2.5 rounded-full overflow-hidden mb-6 relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.5, ease: "easeInOut" }}
                className="h-full bg-[#FF5F15] shadow-[0_0_10px_#FF5F15]"
              />
            </div>

            <div className="h-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm font-mono text-[#FF5F15] font-bold"
                >
                  {calibrationTexts[loadingStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-[10px] text-zinc-550 font-mono mt-8 uppercase tracking-widest animate-pulse max-w-sm leading-normal">
              Structuring biological targets under {selectedTier.toUpperCase()} framework protocol
            </p>

            {errorMsg && (
              <div className="text-amber-500 text-xs font-mono text-center mt-6 border border-white/10 p-3 rounded bg-zinc-900/60 max-w-md">
                {errorMsg}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* DETAILED MODAL OVERLAYS */}
      <AnimatePresence>
        {activeModal !== null && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-xl relative max-h-[90vh] overflow-y-auto font-sans text-zinc-300"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* CARD 1 MODAL content: Body composition */}
              {activeModal === "body" && (
                <div>
                  <div className="mb-6 flex items-center space-x-3 border-b border-white/10 pb-4">
                    <User className="w-5 h-5 text-[#FF5F15]" />
                    <h3 className="text-lg font-black uppercase tracking-wider text-white italic">01 / Body Composition Specs</h3>
                  </div>

                  <div className="space-y-5">
                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400 mb-1.5">Candidate Name</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Recruit Miller"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5F15]"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">User Age Range</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{age} YRS</span>
                      </div>
                      <input
                        type="range"
                        min="18"
                        max="90"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Biological Stature</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{height} CM</span>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="220"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Body Mass Weight</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{weight} KG</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="180"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Waist Circumference</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{waist} CM</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={waist}
                        onChange={(e) => setWaist(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Hip Circumference</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{hip} CM</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        value={hip}
                        onChange={(e) => setHip(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    {(() => {
                      const whr = Math.round((waist / hip) * 100) / 100;
                      let classification = "Healthy Composite (High Active)";
                      let classColor = "text-emerald-400";
                      if (whr > 0.90) {
                        classification = "Increased Visceral Profile";
                        classColor = "text-[#FF5F15]";
                      }
                      return (
                        <div className="p-4 bg-zinc-950 border border-dashed border-white/10 rounded-xl flex items-center justify-between font-mono">
                          <div>
                            <span className="text-[9px] uppercase text-zinc-550 block font-bold">Waist-To-Hip Ratio (WHR)</span>
                            <span className={`text-[10px] font-bold mt-1 block ${classColor}`}>{classification}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-white">{whr}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* CARD 2 MODAL content: Nutrition */}
              {activeModal === "nutrition" && (
                <div>
                  <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Apple className="w-5 h-5 text-[#FF5F15]" />
                      <h3 className="text-lg font-black uppercase tracking-wider text-white italic">02 / Macronutrient & Fuel Lab</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoCalibrateMacros}
                      className="px-3.5 py-1.5 bg-[#FF5F15]/10 hover:bg-[#FF5F15] hover:text-black border border-[#FF5F15]/30 text-[#FF5F15] text-[9px] font-mono font-black uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Calibrate Macros</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold font-mono tracking-widest text-zinc-400">
                        1. SELECT DIET REGIMEN PROTOCOL
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["Carnivore", "Keto", "Low-carb", "Diet cycling"] as const).map((diet) => (
                          <button
                            key={diet}
                            type="button"
                            onClick={() => setDietPreference(diet)}
                            className={`py-3 px-4 rounded-xl border text-center text-xs font-mono font-bold tracking-wider transition-all uppercase cursor-pointer ${
                              dietPreference === diet 
                                ? "bg-[#FF5F15] text-black border-[#FF5F15]" 
                                : "bg-zinc-950/80 border-white/5 text-zinc-400 hover:border-white/10"
                            }`}
                          >
                            {diet}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Total Energy Quota</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{caloriesTarget} KCAL</span>
                      </div>
                      <input
                        type="range"
                        min="1200"
                        max="4000"
                        step="50"
                        value={caloriesTarget}
                        onChange={(e) => setCaloriesTarget(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-zinc-950/60 border border-white/5 rounded-xl text-center">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block mb-1">Protein</span>
                        <input
                          type="number"
                          value={proteinTarget}
                          onChange={(e) => setProteinTarget(parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-900 border border-white/15 rounded p-1 text-center font-mono font-black text-white text-xs"
                        />
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold block mt-1">({proteinTarget * 4} kcal)</span>
                      </div>

                      <div className="p-3 bg-zinc-950/60 border border-white/5 rounded-xl text-center">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block mb-1">Fats</span>
                        <input
                          type="number"
                          value={fatsTarget}
                          onChange={(e) => setFatsTarget(parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-900 border border-white/15 rounded p-1 text-center font-mono font-black text-white text-xs"
                        />
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold block mt-1">({fatsTarget * 9} kcal)</span>
                      </div>

                      <div className="p-3 bg-zinc-950/60 border border-white/5 rounded-xl text-center">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block mb-1">Carbs</span>
                        <input
                          type="number"
                          value={carbsTarget}
                          onChange={(e) => setCarbsTarget(parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-900 border border-white/15 rounded p-1 text-center font-mono font-black text-white text-xs"
                        />
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold block mt-1">({carbsTarget * 4} kcal)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 3 MODAL content: Habits & Sleep */}
              {activeModal === "habits" && (
                <div>
                  <div className="mb-6 flex items-center space-x-3 border-b border-white/10 pb-4">
                    <Brain className="w-5 h-5 text-[#FF5F15]" />
                    <h3 className="text-lg font-black uppercase tracking-wider text-white italic">03 / Habits & Daily Hygiene</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Sleep Duration Goal</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{sleepHoursTarget} HOURS</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="10"
                        value={sleepHoursTarget}
                        onChange={(e) => setSleepHoursTarget(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Daily Water Goal</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{hydrationTarget} GLASSES</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="16"
                        value={hydrationTarget}
                        onChange={(e) => setHydrationTarget(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400">Daily Steps Goal</span>
                        <span className="text-xs font-bold text-[#FF5F15] font-mono">{stepsTarget.toLocaleString()} STEPS</span>
                      </div>
                      <input
                        type="range"
                        min="6000"
                        max="18000"
                        step="1000"
                        value={stepsTarget}
                        onChange={(e) => setStepsTarget(parseInt(e.target.value))}
                        className="w-full accent-[#FF5F15] h-1 bg-zinc-900 cursor-pointer rounded"
                      />
                    </div>

                    <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-xl space-y-3">
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400 block mb-1">
                        TACTICAL COMPLIANCE VICES LOCK
                      </span>
                      {[
                        { id: "quitSmoking", label: "Quit Nicotine & Smoking (Vaping)" },
                        { id: "quitAlcohol", label: "Isolate Alcohol Intake (Liquor Detox)" },
                        { id: "quitDrugs", label: "Eliminate Toxins & Narcotic Stimulants" },
                        { id: "quitNegativeCompany", label: "Lock Negative Digital Networks / Screen Addictions" },
                      ].map((vice) => {
                        const checked = selectedVices.includes(vice.id);
                        return (
                          <button
                            key={vice.id}
                            type="button"
                            onClick={() => toggleVice(vice.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              checked 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-450" 
                                : "bg-zinc-950/50 border-white/5 text-zinc-400 hover:border-white/10"
                            }`}
                          >
                            <span className="text-xs font-mono font-bold">{vice.label}</span>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              checked ? "bg-emerald-500 border-emerald-500 text-black" : "border-zinc-700"
                            }`}>
                              {checked && <Check className="w-2.5 h-2.5 stroke-[4.5]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 4 MODAL content: AI Coach & Tiers */}
              {activeModal === "tiers" && (
                <div>
                  <div className="mb-6 flex items-center space-x-3 border-b border-white/10 pb-4">
                    <MessageSquareCode className="w-5 h-5 text-[#FF5F15]" />
                    <h3 className="text-lg font-black uppercase tracking-wider text-white italic">04 / AI Coach & Upgrade Tiers</h3>
                  </div>

                  <div className="space-y-4 font-sans text-zinc-300">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* FREE TIER */}
                      <button
                        type="button"
                        onClick={() => setSelectedTier("free")}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedTier === "free" ? "bg-zinc-900 border-white/30" : "bg-zinc-950/50 border-white/5 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-black uppercase text-white">Civilian</span>
                          <span className="text-[10px] font-mono text-zinc-400">FREE FOREVER</span>
                        </div>
                        <p className="text-[10px] text-zinc-450 mt-1.5 leading-relaxed">
                          Access metrics, default logging interfaces, and locally-cached progress charts.
                        </p>
                      </button>

                      {/* SPEC OPS TIER */}
                      <button
                        type="button"
                        onClick={() => setSelectedTier("spec-ops")}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                          selectedTier === "spec-ops" ? "bg-[#FF5F15]/10 border-[#FF5F15]" : "bg-zinc-950/50 border-white/5 opacity-60"
                        }`}
                      >
                        <span className="absolute -top-2 right-4 bg-[#FF5F15] text-black text-[7px] font-mono font-black uppercase px-2 py-0.5 rounded-full tracking-widest shadow-[0_0_5px_#FF5F15]">
                          RECOMMENDED
                        </span>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-black uppercase text-[#FF5F15] flex items-center gap-1">Spec-Ops <Zap className="w-3.5 h-3.5" /></span>
                          <span className="text-[10px] font-mono text-[#FF5F15]">$19 / MONTH</span>
                        </div>
                        <p className="text-[10px] text-zinc-300 mt-1.5 leading-relaxed">
                          Get unlimited server-side calibrated AI Coach interactions, automatic macros rebalancing, and personalized challenges parsing.
                        </p>
                      </button>

                      {/* GENERAL OVERLORD TIER */}
                      <button
                        type="button"
                        onClick={() => setSelectedTier("general")}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedTier === "general" ? "bg-zinc-900 border-[#FF5F15]/50" : "bg-zinc-950/50 border-white/5 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-black uppercase text-white flex items-center gap-1">General <Award className="w-3.5 h-3.5" /></span>
                          <span className="text-[10px] font-mono text-zinc-400">$49 / MONTH</span>
                        </div>
                        <p className="text-[10px] text-zinc-450 mt-1.5 leading-relaxed">
                          Includes priority server queues, detailed lipid blood biochemistry advisory overlays, and direct coaches audits.
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save & close modal action */}
              <div className="mt-6 border-t border-white/10 pt-4 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-[#FF5F15] hover:bg-orange-600 text-black font-black font-mono text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  SAVE & CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
