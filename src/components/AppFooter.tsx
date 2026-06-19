import React from "react";
import { useCommando } from "../context/CommandoContext";

interface AppFooterProps {
  onOpenLegal: (type: "tos" | "privacy") => void;
}

export default function AppFooter({ onOpenLegal }: AppFooterProps) {
  const { state, setActiveTab } = useCommando();
  const { activeTab } = state;

  return (
    <footer className="mt-12 bg-[#FF5F15] text-[#0A0A0A] p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center relative z-20">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div className="text-base font-black uppercase tracking-tight font-sans">
          Become the Real-Life Radical
        </div>
        <div className="text-[10px] tracking-wider uppercase opacity-85 font-mono font-bold mt-1">
          Civilian Science & Nutrition Programming System
        </div>
        <div className="mt-2.5 flex items-center gap-4 text-[10px] font-mono font-black uppercase">
          <button
            type="button"
            onClick={() => onOpenLegal("tos")}
            className="hover:underline text-black cursor-pointer bg-transparent border-none p-0"
          >
            Terms of Service
          </button>
          <span className="opacity-50">•</span>
          <button
            type="button"
            onClick={() => onOpenLegal("privacy")}
            className="hover:underline text-black cursor-pointer bg-transparent border-none p-0"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Dynamic Progression Phasing Markers */}
      <div className="flex gap-8 md:gap-12 font-black text-xs uppercase text-center md:text-left select-none">
        <div className="flex flex-col">
          <span className="opacity-60 text-[9px] font-bold font-mono">Phase 01</span>
          <span className={activeTab === "onboarding" ? "text-white underline decoration-2" : ""}>Foundation</span>
        </div>
        <div className="flex flex-col">
          <span className="opacity-60 text-[9px] font-bold font-mono">Phase 02</span>
          <span className={activeTab === "dashboard" ? "text-white underline decoration-2 animate-pulse" : ""}>Transformation</span>
        </div>
        <div className="flex flex-col">
          <span className="opacity-60 text-[9px] font-bold font-mono">Phase 03</span>
          <span>Ascension</span>
        </div>
      </div>

      {/* Footer Trigger buttons */}
      <div>
        {activeTab === "landing" && (
          <button 
            type="button"
            onClick={() => setActiveTab("onboarding")}
            className="bg-[#0A0A0A] text-[#F5F5F5] hover:bg-zinc-900 border border-white/10 px-8 py-3.5 font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all cursor-pointer font-sans"
          >
            Initiate Program
          </button>
        )}
        {activeTab === "onboarding" && (
          <button 
            type="button"
            onClick={() => setActiveTab("landing")}
            className="bg-[#0A0A0A] text-[#F5F5F5] hover:bg-zinc-900 border border-white/10 px-8 py-3.5 font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer font-mono"
          >
            Cancel Setup
          </button>
        )}
        {activeTab === "dashboard" && (
          <button 
            type="button"
            onClick={() => {
              if (window.confirm("Return to main promotional page? Generated dashboard data remains saved!")) {
                setActiveTab("landing");
              }
            }}
            className="bg-[#0A0A0A] text-[#F5F5F5] hover:bg-zinc-900 border border-white/10 px-8 py-3.5 font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer font-sans"
          >
            Lobby Home
          </button>
        )}
      </div>
    </footer>
  );
}
