import React from "react";
import { motion } from "motion/react";
import { Activity, Apple, Brain, ChevronRight } from "lucide-react";
import { useCommando } from "../context/CommandoContext";

export default function LandingPage() {
  const { setActiveTab } = useCommando();

  return (
    <motion.div
      key="landing-screen"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-12 my-6"
    >
      <div className="flex flex-col">
        {/* Big stylistic title of Artistic Flair */}
        <h1 
          className="text-6xl sm:text-[100px] md:text-[140px] font-black leading-[0.8] tracking-tighter uppercase italic text-transparent" 
          style={{ WebkitTextStroke: "2px #F5F5F5" }}
        >
          Radical
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between -mt-2 md:-mt-4 gap-6">
          <p className="max-w-xl text-sm sm:text-base opacity-70 leading-relaxed font-light text-zinc-350">
            RADICAL is a pop fitness transformation system built on the Radical Triangle — <strong>Fitness</strong>, <strong>Diet</strong>, and <strong>Habits</strong>. 
            No extreme drills on mud. Pure civilian science. Eat like someone who respects their bloodline, build cellular aerobic endurance, and command daily non-negotiable mental structures.
          </p>
          <div className="text-6xl sm:text-[100px] md:text-[140px] font-black leading-[0.8] tracking-tighter uppercase text-[#FF5F15] transform md:translate-y-4">
            Fitness
          </div>
        </div>
      </div>

      {/* Grid 01, 02, 03 Pillars Illustration */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10 mt-6 pt-2">
        
        {/* Column 1 - Fitness */}
        <div className="border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col justify-between group hover:bg-[#FF5F15]/5 transition-all duration-350">
          <div>
            <div className="text-[32px] md:text-[40px] font-black tracking-tight mb-2 text-zinc-650 group-hover:text-[#FF5F15] transition-colors">01</div>
            <div className="text-xs uppercase tracking-widest text-[#FF5F15] font-bold mb-6 flex items-center justify-between">
              <span>Radical Fitness</span>
              <Activity className="w-4 h-4 ml-2" />
            </div>
            <ul className="space-y-4">
              <li className="border-l-2 border-[#FF5F15] pl-4">
                <div className="text-base md:text-lg font-bold text-white">Zone 2 Aerobic Training</div>
                <div className="text-[10px] opacity-55 uppercase tracking-wide">Builds Cellular Mitochondria Engine</div>
              </li>
              <li className="border-l-2 border-white/20 pl-4">
                <div className="text-base md:text-lg font-bold text-zinc-300">Raw Compound Strength</div>
                <div className="text-[10px] opacity-55 uppercase tracking-wide">Metabolic Guard & Bone Suture</div>
              </li>
              <li className="border-l-2 border-white/20 pl-4">
                <div className="text-base md:text-lg font-bold text-zinc-300">Targeted Conditioning</div>
                <div className="text-[10px] opacity-55 uppercase tracking-wide">Real-world Athletic Lung Capacity</div>
              </li>
            </ul>
          </div>
          <div className="text-[10px] uppercase tracking-tighter opacity-40 italic mt-8">Civilian Science Stabilization</div>
        </div>

        {/* Column 2 - Diet */}
        <div className="border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col justify-between group hover:bg-[#FF5F15]/5 transition-all duration-350">
          <div>
            <div className="text-[32px] md:text-[40px] font-black tracking-tight mb-2 text-zinc-650 group-hover:text-[#FF5F15] transition-colors">02</div>
            <div className="text-xs uppercase tracking-widest text-[#FF5F15] font-bold mb-6 flex items-center justify-between">
              <span>Radical Diet</span>
              <Apple className="w-4 h-4 ml-2" />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {["Carnivore", "Keto", "Low-Carb", "Diet cycling"].map((di) => (
                <span key={di} className="px-2.5 py-0.5 border border-white/20 rounded-full text-[9px] uppercase font-bold text-zinc-300 font-mono">
                  {di}
                </span>
              ))}
            </div>
            <p className="text-xs italic font-serif leading-relaxed text-zinc-300 mb-6 border-l border-[#FF5F15]/40 pl-4">
              &ldquo;Eat like someone who respects their biological organism. Simple menu parameters, low blood sugar volatility, healthy saturated lipid anchors.&rdquo;
            </p>
          </div>
          <div className="pt-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">Dietary Target Weight Control</div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF5F15] w-3/4" />
            </div>
          </div>
        </div>

        {/* Column 3 - Habits */}
        <div className="p-6 md:p-8 flex flex-col justify-between group hover:bg-[#FF5F15]/5 transition-all duration-350">
          <div>
            <div className="text-[32px] md:text-[40px] font-black tracking-tight mb-2 text-zinc-650 group-hover:text-[#FF5F15] transition-colors">03</div>
            <div className="text-xs uppercase tracking-widest text-[#FF5F15] font-bold mb-6 flex items-center justify-between">
              <span>Radical Habits</span>
              <Brain className="w-4 h-4 ml-2" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="opacity-60 font-mono">CUT PROTOCOL</span>
                <span className="font-mono text-[#FF5F15] font-bold">ZERO TOXIC VICES</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="opacity-60 font-mono">SLEEP DISCIPLINE</span>
                <span className="font-mono text-zinc-200">MAXIMIZE DEEP REM</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="opacity-60 font-mono">DAILY WALKING</span>
                <span className="font-mono text-zinc-200">12,000 STEPS TARGET</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="opacity-60 font-mono">IDENTITY ALIGNED</span>
                <span className="font-mono text-zinc-200">UNSTOPPABLE BEHAVIOR</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-8 h-8 rounded-full border border-[#FF5F15] flex items-center justify-center text-[#FF5F15] text-[10px] font-black">
              CMD
            </div>
            <span className="text-[9px] uppercase tracking-widest opacity-60 font-mono font-bold">
              Identity is the Force-Multiplier
            </span>
          </div>
        </div>

      </div>

      {/* Call to action panel */}
      <div className="flex flex-col items-center justify-center py-6">
        <button
          onClick={() => setActiveTab("onboarding")}
          className="bg-[#FF5F15] hover:bg-orange-600 text-[#0A0A0A] px-12 py-4 font-black text-sm uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,95,21,0.3)] min-w-[280px] flex items-center justify-center space-x-3 cursor-pointer"
        >
          <span>Build Elite Program</span>
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="text-[10px] tracking-widest text-zinc-500 font-mono uppercase mt-4">
          No credit cards needed ● Uses Secure Server-Side Gemini API calibration
        </div>
      </div>

      {/* Legal & Medical Disclaimers */}
      <div className="border-t border-white/10 pt-6 mt-12 max-w-2xl mx-auto text-center">
        <p className="text-[11px] text-zinc-550 leading-relaxed font-sans">
          <strong>Medical Disclaimer:</strong> RADICAL is a fitness tracking and instructional application. It does not provide medical advice, diagnosis, or treatment. Always consult your physician or a qualified healthcare provider before starting any new exercise program, nutrition plan, or habit regimen.
        </p>
      </div>
    </motion.div>
  );
}
