import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useCommando } from "../context/CommandoContext";
import { ChatMessage } from "../types";

export default function CoachCard() {
  const { 
    state, 
    setChatMessages, 
    setIsCoachTyping, 
    setDashboardPage 
  } = useCommando();

  const { 
    profile, 
    chatMessages, 
    isCoachTyping, 
    dashboardPage 
  } = state;

  const [inputMsg, setInputMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isCoachTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentMessages = [...chatMessages, userMsg];
    setChatMessages(currentMessages);
    setInputMsg("");
    setIsCoachTyping(true);

    try {
      const response = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          userProfile: profile || {
            name: "Recruit",
            age: 30,
            weight: 80,
            height: 180,
            trainingLevel: "Intermediate",
            dietPreference: "Keto",
            focusGoal: "Optimizing overall capacity"
          }
        })
      });

      if (!response.ok) throw new Error("Coach connection timed out");
      const data = await response.json();

      setIsCoachTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          id: `coach-${Date.now()}`,
          sender: "coach",
          text: data.text || "Your question has been processed. Continue maintaining strict compound resistance structure and Zone 2 rucking.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setIsCoachTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          id: `coach-err-${Date.now()}`,
          sender: "coach",
          text: "Communications error on server. Remember the primary rule: clean animal fats, conversational Zone 2 cardio, 10,000 daily steps. No negotiations.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const isCoachPage = dashboardPage === "coach";

  return (
    <section 
      id="ai-coach" 
      className={`bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden ${
        isCoachPage ? "lg:col-span-3 border-[#FF5F15]/30 shadow-[0_0_40px_rgba(255,95,21,0.08)]" : ""
      }`}
      aria-label="AI Coach chat panel"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5F15]/3 rounded-full filter blur-[80px] pointer-events-none" />
      
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded bg-zinc-900 border border-white/15 flex items-center justify-center text-[#FF5F15] shadow-[0_0_15px_rgba(255,95,21,0.1)]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg uppercase tracking-tight text-white flex items-center gap-1.5">
              RADICAL AI Coaching Station
              <span className="text-[10px] bg-[#FF5F15]/10 text-[#FF5F15] px-2 py-0.5 rounded border border-[#FF5F15]/20 font-mono normal-case tracking-normal">
                {isCoachPage ? "PAGE ACTIVE" : "Online"}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Ask any physical training, lipid nutritional, or psychological discipline inquiries directly to the AI coach.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm("Clean entire chat history?")) {
                setChatMessages([
                  { 
                    id: "m-1", 
                    sender: "coach", 
                    text: "Stand tall. AI Coach log synchronized. Submit specs to begin coaching optimization.", 
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  }
                ]);
              }
            }}
            className="bg-zinc-900 border border-white/5 hover:border-red-500/20 text-zinc-400 hover:text-red-400 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            Clear Log
          </button>

          {dashboardPage === "overview" ? (
            <button
              onClick={() => setDashboardPage("coach")}
              className="bg-[#FF5F15]/10 hover:bg-[#FF5F15]/20 text-[#FF5F15] border border-[#FF5F15]/15 px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0"
            >
              Open Page →
            </button>
          ) : (
            <button
              onClick={() => setDashboardPage("overview")}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase cursor-pointer transition-all shrink-0"
            >
              ← Overview
            </button>
          )}
        </div>
      </div>

      {/* Messages thread */}
      <div className="h-[320px] overflow-y-auto mb-4 bg-zinc-950/60 p-4 border border-white/5 rounded-xl space-y-4 font-mono text-xs">
        {chatMessages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 mb-1 font-bold">
              <span>{msg.sender === "user" ? "RADICAL OPERATOR" : "RADICAL AI COACH"}</span>
              <span>●</span>
              <span>{msg.timestamp}</span>
            </div>
            <div 
              className={`p-3.5 rounded-xl border leading-relaxed ${
                msg.sender === "user" 
                  ? "bg-[#FF5F15] text-[#0A0A0A] border-[#FF5F15] font-bold font-sans" 
                  : "bg-zinc-900/60 text-zinc-250 border-white/5"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Coach typing loader */}
        {isCoachTyping && (
          <div className="flex flex-col mr-auto items-start max-w-[85%]">
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 mb-1 font-bold">
              <span>RADICAL AI COACH</span>
              <span>●</span>
              <span>Thinking...</span>
            </div>
            <div className="p-3 bg-zinc-900/80 text-zinc-405 border border-white/5 rounded-xl flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F15] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F15] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F15] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat prompt form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Inquire: e.g. How to handle sore muscles? Or heart-rate zones?"
          className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-mono focus:outline-none focus:border-[#FF5F15] transition-colors"
          aria-label="Message text"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || isCoachTyping}
          className="bg-[#FF5F15] hover:bg-orange-600 font-bold px-6 rounded-xl flex items-center justify-center text-[#0A0A0A] disabled:opacity-40 transition-all cursor-pointer border border-[#FF5F15]/40"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}
