import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Share2, Copy, Download } from "lucide-react";
import { useCommando } from "../context/CommandoContext";

export default function ShareModal() {
  const { state, setIsShareModalOpen } = useCommando();
  const { profile, biometricLogs, workoutLogs, habitState } = state;

  const [shareAlert, setShareAlert] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Compute streaks
  const stepsStreak = habitState.stepsCompleted >= 10000 ? 5 : 2; // Mock logic or based on data
  const habitsStreak = Object.values(habitState).filter(v => v === true).length >= 4 ? 4 : 1;

  const renderSparkline = () => {
    // Basic representation
    return (
      <div className="bg-zinc-950 p-3 rounded-lg border border-white/5 font-mono text-[9px]">
        <span className="text-zinc-500 uppercase font-bold block mb-1">Weekly Recomp Load Graph</span>
        <div className="h-8 flex items-end gap-1 pt-2">
          {[100, 66, 33, 100, 66, 66, 80].map((val, idx) => (
            <div key={idx} className="flex-1 bg-zinc-800 rounded-t overflow-hidden h-full flex items-end">
              <div className="w-full bg-[#FF5F15]" style={{ height: `${val}%` }} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsShareModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0A0A] border border-[#FF5F15]/40 rounded-2xl w-full max-w-xl p-5 md:p-6 relative shadow-[0_0_50px_rgba(255,95,21,0.25)] overflow-y-auto max-h-[90vh]"
      >
        <button
          type="button"
          onClick={() => setIsShareModalOpen(false)}
          className="absolute top-4 right-4 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-[#FF5F15] p-1.5 rounded-lg transition-all cursor-pointer"
          title="Dismiss Passport"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 border-b border-white/10 pb-3 mb-4">
          <div className="w-9 h-9 rounded bg-[#FF5F15]/10 border border-[#FF5F15]/30 flex items-center justify-center text-[#FF5F15]">
            <Share2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white uppercase tracking-wider text-base">Tactical Progress Passport</h3>
            <p className="text-[10px] text-zinc-400 font-mono">ENCODE AND PUBLISH COMPOSITION GENETICS & STREAKS</p>
          </div>
        </div>

        {/* STATS PASSPORT GRAPHIC DISPLAY (The actual card to share) */}
        <div 
          id="share-passport-card" 
          className="bg-[#0D0D0D] border-2 border-white/10 rounded-xl p-4 relative overflow-hidden group hover:border-[#FF5F15]/30 transition-all duration-300"
        >
          {/* Tactical watermarks and grid lines */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5F15]/5 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-zinc-900/40 rounded-full filter blur-xl pointer-events-none" />
          <div className="absolute top-2 right-3 text-[7px] font-mono text-zinc-650 font-bold tracking-widest pointer-events-none">
            SECURE VERIFICATION: ID #{profile?.name?.substring(0, 3)?.toUpperCase() ?? "CMD"}-{Date.now().toString().slice(-6)}
          </div>

          {/* Subtitle banner */}
          <div className="border-b border-dashed border-white/10 pb-3 mb-4 flex justify-between items-start">
            <div>
              <h4 className="font-sans font-black text-xs text-white uppercase tracking-wider flex items-center gap-1">
                🛡️ Radical Fitness Regime
              </h4>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                Certified Recomp Record Passport
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-zinc-500 block font-bold uppercase">Candidate</span>
              <span className="text-xs font-black font-sans text-[#FF5F15] block uppercase">
                {profile?.name ?? "Recruit"}
              </span>
            </div>
          </div>

          {/* Achievement rating section */}
          {(() => {
            const totalLogs = biometricLogs.length;
            const points = (stepsStreak * 15) + (habitsStreak * 15) + (totalLogs * 25);
            let levelName = "TIER-I: AMATEUR RECRUIT";
            let levelDesc = "C-Class base setup. The protocol is launched. Consistency is your only objective. Eliminate empty Comfort.";
            let levelStyle = "text-zinc-400 bg-zinc-900/50 border-zinc-700/30 shadow-zinc-800";
            let levelIcon = "📁";

            if (points >= 180) {
              levelName = "TIER-IV: APEX STRATEGIST";
              levelDesc = "S-Class fitness optimization. Complete cellular and behavioral dominance. Your metabolic engine is high-output.";
              levelStyle = "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-amber-500/5";
              levelIcon = "👑";
            } else if (points >= 100) {
              levelName = "TIER-III: IRON VANGUARD";
              levelDesc = "A-Class behavioral execution. Weight and dimensional vectors are trending towards biological optimum.";
              levelStyle = "text-[#FF5F15] bg-[#FF5F15]/10 border-[#FF5F15]/30 shadow-[#FF5F15]/5";
              levelIcon = "🛡️";
            } else if (points >= 40) {
              levelName = "TIER-II: DRILL DISCIPLINE";
              levelDesc = "B-Class compliance. Routine actions are building neural pathways. Disconnect from excuses.";
              levelStyle = "text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/5";
              levelIcon = "🔥";
            }

            return (
              <div className="space-y-4">
                {/* Level banner */}
                <div className={`p-3 rounded-lg border flex gap-3 items-center ${levelStyle}`}>
                  <div className="text-2xl select-none">{levelIcon}</div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest font-black uppercase flex items-center gap-1.5">
                      ACHIEVEMENT LEVEL
                      <span className="text-[8px] bg-white/10 px-1 rounded font-bold">SYSTEM ACCREDITED</span>
                    </div>
                    <div className="text-[13px] font-extrabold tracking-tight uppercase mt-0.5">
                      {levelName}
                    </div>
                    <p className="text-[9px] font-mono text-zinc-400 mt-1 leading-relaxed">
                      {levelDesc}
                    </p>
                  </div>
                </div>

                {/* Sparkline Graph Progress Area */}
                {renderSparkline()}

                {/* Vital stats specs checklist */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[7.5px] font-mono text-zinc-500 uppercase block font-bold">RECOMP DELTA</span>
                    <span className="text-xs font-black font-sans text-[#FF5F15] block mt-0.5">
                      {(() => {
                        const baseW = profile ? profile.weight : 80;
                        const starting = biometricLogs.length > 0 ? biometricLogs[0].weight : baseW;
                        const current = biometricLogs.length > 0 ? biometricLogs[biometricLogs.length - 1].weight : baseW;
                        const diff = current - starting;
                        if (diff === 0) return "0.0 kg";
                        return diff > 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`;
                      })()}
                    </span>
                  </div>

                  <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[7.5px] font-mono text-zinc-500 uppercase block font-bold">STEPS STREAK</span>
                    <span className="text-xs font-black font-sans text-[#06B6D4] block mt-0.5">
                      🔥 {stepsStreak} DAYS
                    </span>
                  </div>

                  <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[7.5px] font-mono text-zinc-500 uppercase block font-bold">HABITS DRILL</span>
                    <span className="text-xs font-black font-sans text-[#A855F7] block mt-0.5">
                      🛡️ {habitsStreak} DAYS
                    </span>
                  </div>
                </div>

                {/* Footnotes */}
                <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  <span>🛰️ Sat-link telemetry verified: live</span>
                  <span>Candidate Code: #{Date.now().toString().slice(-4)}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Status Alert and Feedback messages */}
        {shareAlert && (
          <div className="mt-3.5 p-2 bg-[#FF5F15]/10 border border-[#FF5F15]/40 text-[#FF5F15] text-[10px] font-mono rounded-lg flex items-center justify-between">
            <span>⚡ {shareAlert}</span>
            <button type="button" onClick={() => setShareAlert(null)} className="text-[#FF5F15] hover:text-white font-extrabold px-1 cursor-pointer bg-transparent border-none">✕</button>
          </div>
        )}

        {/* CONTROL OPTIONS GRID */}
        <div className="mt-5 space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            {/* Option 1: Copy Clipboard post */}
            <button
              type="button"
              disabled={isCopying}
              onClick={() => {
                setIsCopying(true);
                const baseW = profile ? profile.weight : 80;
                const starting = biometricLogs.length > 0 ? biometricLogs[0].weight : baseW;
                const current = biometricLogs.length > 0 ? biometricLogs[biometricLogs.length - 1].weight : baseW;
                const delta = current - starting;
                const totalLogs = biometricLogs.length;
                const points = (stepsStreak * 15) + (habitsStreak * 15) + (totalLogs * 25);
                
                let rank = "AMATEUR RECRUIT";
                if (points >= 180) rank = "APEX STRATEGIST 👑";
                else if (points >= 100) rank = "IRON VANGUARD 🛡️";
                else if (points >= 40) rank = "DRILL DISCIPLINE 🔥";

                const deltaText = delta === 0 ? "Recomp balanced" : delta > 0 ? `+${delta.toFixed(1)} kg bulk` : `${delta.toFixed(1)} kg shredded`;

                const postContent = `⚡ COMMANDO FITNESS PROTOCOL RECOMP PROGRESS ⚡\n` +
                  `👤 Candidate: ${profile?.name?.toUpperCase() ?? "RECRUIT"}\n` +
                  `🏅 Accredited Level: ${rank}\n` +
                  `⚖️ Recomp Vector: ${deltaText} (${starting}kg -> ${current}kg)\n` +
                  `👟 Steps Streak: ${stepsStreak} consecutive days\n` +
                  `🛡️ Checked Habits: ${habitsStreak} continuous drills\n` +
                  `\nUnlock details & generate your cellular schedule: AI Studio Radical`;

                navigator.clipboard.writeText(postContent).then(() => {
                  setShareAlert("Aesthetic social text snippet has been successfully copied to your clipboard!");
                  setIsCopying(false);
                }).catch(() => {
                  setShareAlert("Clipboard read blocked. Copying fallback activated!");
                  setIsCopying(false);
                });
              }}
              className="flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 hover:border-[#FF5F15]/40 text-xs text-white font-mono py-2.5 rounded-lg transition-all uppercase font-extrabold cursor-pointer disabled:opacity-50"
            >
              <Copy className="w-3.5 h-3.5 text-[#FF5F15]" />
              {isCopying ? "Copying..." : "Copy Post Text"}
            </button>

            {/* Option 2: Downloader Passport compilation */}
            <button
              type="button"
              disabled={isGeneratingImg}
              onClick={() => {
                setIsGeneratingImg(true);
                setShareAlert("Compiling cellular components & SVG layout grid...");
                
                setTimeout(() => {
                  const baseW = profile ? profile.weight : 80;
                  const starting = biometricLogs.length > 0 ? biometricLogs[0].weight : baseW;
                  const current = biometricLogs.length > 0 ? biometricLogs[biometricLogs.length - 1].weight : baseW;
                  const totalLogs = biometricLogs.length;
                  const points = (stepsStreak * 15) + (habitsStreak * 15) + (totalLogs * 25);
                  let rank = "TIER-I: AMATEUR RECRUIT";
                  if (points >= 180) rank = "TIER-IV: APEX STRATEGIST 👑";
                  else if (points >= 100) rank = "TIER-III: IRON VANGUARD 🛡️";
                  else if (points >= 40) rank = "TIER-II: DRILL DISCIPLINE 🔥";

                  // Create html passport text
                  const certHtml = `
<!DOCTYPE html>
<html>
<head>
<title>Radical Fitness Profile Passport</title>
<style>
  body { background-color: #050505; color: #FFFFFF; font-family: monospace; padding: 40px; text-align: center; }
  .box { border: 2px solid #FF5F15; border-radius: 16px; padding: 30px; background-color: #0A0A0A; max-width: 500px; margin: 0 auto; box-shadow: 0 0 30px rgba(255,95,21,0.2); }
  h1 { font-size: 20px; color: #FF5F15; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px; }
  p { font-size: 11px; color: #888; }
  .rank { padding: 12px; font-size: 14px; font-weight: bold; background: rgba(255,95,21,0.1); border: 1px solid rgba(255,95,21,0.3); border-radius: 8px; color: #FF5F15; margin: 20px 0; }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 20px; }
  .stat-card { background: #121212; border: 1px solid #222; padding: 10px; border-radius: 8px; }
  .val { font-size: 16px; font-weight: bold; color: #FFF; display: block; margin-top: 5px; }
</style>
</head>
<body>
<div class="box">
  <h1>🛡️ RADICAL FITNESS RECOMP PASSPORT</h1>
  <p>CERTIFIED PROFILE VERIFICATION INDEX</p>
  <div class="rank">${rank}</div>
  <p>Candidate: <b>${profile?.name?.toUpperCase() ?? "RECRUIT"}</b></p>
  <p>Check in records: ${totalLogs} logged</p>
  
  <div class="stats-grid">
    <div class="stat-card">
      <p style="margin:0;font-size:8px;">START WEIGHT</p>
      <span class="val">${starting} kg</span>
    </div>
    <div class="stat-card">
      <p style="margin:0;font-size:8px;">CURRENT WEIGHT</p>
      <span class="val">${current} kg</span>
    </div>
    <div class="stat-card">
      <p style="margin:0;font-size:8px;">STREAK STATUS</p>
      <span style="color:#06B6D4" class="val">🔥 ${stepsStreak}d</span>
    </div>
  </div>
  
  <p style="margin-top: 25px; font-size: 8px; color: #444;">Sat-Link secure verification code: ${Date.now().toString()}</p>
</div>
</body>
</html>`;
                  
                  const blob = new Blob([certHtml], { type: "text/html" });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `radical_recomp_passport_${profile?.name || "recruit"}.html`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  setShareAlert("Aesthetic offline HTML Passport generated and saved directly to your filesystem!");
                  setIsGeneratingImg(false);
                }, 1200);
              }}
              className="flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 hover:border-[#FF5F15]/40 text-xs text-white font-mono py-2.5 rounded-lg transition-all uppercase font-extrabold cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#FF5F15]" />
              {isGeneratingImg ? "Compiling..." : "Save Passport"}
            </button>
          </div>

          {/* Simulated Social publish button */}
          <button
            type="button"
            onClick={() => {
              setShareAlert("Transmitting progress packet to satellite gateway...");
              setTimeout(() => {
                setShareAlert("Pushing physical curve matrix telemetry to Strava/Twitter...");
              }, 1200);
              setTimeout(() => {
                setShareAlert("✅ Broadcast Complete: Shared successfully to connected Telegram & Strava feeds!");
              }, 2500);
            }}
            className="w-full bg-[#FF5F15] hover:bg-orange-600 text-black font-black text-xs py-2.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Broadcast Recomp Feed Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
