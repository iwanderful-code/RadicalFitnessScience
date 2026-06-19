import React from "react";
import { useCommando } from "../context/CommandoContext";

export default function NavBar() {
  const { state, setActiveTab, logout } = useCommando();
  const { profile, plan } = state;

  return (
    <nav className="flex justify-between items-center px-6 py-6 md:px-12 border-b border-white/10 relative z-20 bg-[#0A0A0A]/80 backdrop-blur-md">
      <div 
        onClick={() => setActiveTab(profile && plan ? "dashboard" : "landing")}
        className="cursor-pointer group flex items-center space-x-3"
      >
        <div className="w-8 h-8 rounded bg-[#FF5F15] flex items-center justify-center font-black text-[#0A0A0A] text-sm group-hover:scale-105 transition-transform">
          ▲
        </div>
        <div className="text-xs tracking-[0.3em] font-extrabold text-[#FF5F15] uppercase transition-colors group-hover:text-white">
          RADICAL FITNESS SYSTEM
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase opacity-60 font-medium">
        <span className="hidden sm:inline">Version 2.4.0</span>
        {state.isAuthenticated && (
          <>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300 font-bold lowercase">{state.authEmail}</span>
            <button
              onClick={() => {
                logout();
                setActiveTab("landing");
              }}
              className="text-[#FF5F15] hover:underline cursor-pointer border-none bg-transparent font-black tracking-widest uppercase font-mono text-[9px]"
            >
              Sign Out
            </button>
          </>
        )}
        <span className="hidden sm:inline text-zinc-500">|</span>
        <span>System Stable</span>
        <span className="text-[#FF5F15] flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F15] animate-pulse inline-block animate-duration-1000"></span>
          ● Active
        </span>
      </div>
    </nav>
  );
}
