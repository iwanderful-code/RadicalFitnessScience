import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Zap, Crown, ShieldAlert } from "lucide-react";
import { useCommando } from "../context/CommandoContext";

export default function TierSelector() {
  const { state, setIsPaywallOpen, setUserTier, setBillingCycle, setTriggerCelebration } = useCommando();
  const { billingCycle, userTier } = state;
  const [selectedPlanId, setSelectedPlanId] = useState<string>(userTier);

  const planTiers = [
    {
      name: "Free",
      subtitle: "Command Cadet",
      priceWeekly: "0.00",
      priceMonthly: "0.00",
      priceYearly: "0.00",
      features: [
        "Single AI prompt/hour limit",
        "Base steps log entries",
        "3 biometric check-ins",
        "Pure standard guidelines"
      ],
      badge: "RECRUIT BASE",
      available: true
    },
    {
      name: "Tactical Private",
      subtitle: "Active Field Guard",
      priceWeekly: "1.49",
      priceMonthly: "4.99",
      priceYearly: "24.99",
      features: [
        "30 prompts/hour AI limit",
        "Weekly physical curve graph",
        "7 detailed check-ins",
        "Actionable habit checklist"
      ],
      badge: "COMING SOON",
      available: false
    },
    {
      name: "Iron Sergeant",
      subtitle: "Squad Lead Elite",
      priceWeekly: "2.49",
      priceMonthly: "8.99",
      priceYearly: "44.99",
      features: [
        "Unlimited history records",
        "Detailed nutrition macros key",
        "7-Day streak unlock badges",
        "60 prompts/hour priority"
      ],
      badge: "COMING SOON",
      available: false
    },
    {
      name: "Apex Commander",
      subtitle: "Tactical Specialist",
      priceWeekly: "3.99",
      priceMonthly: "14.99",
      priceYearly: "74.99",
      features: [
        "Diagnostic metric charts",
        "High-resolution trends analyser",
        "Infinite body compose logs",
        "Progress Passport share files"
      ],
      badge: "COMING SOON",
      available: false
    },
    {
      name: "Vanguard Marshal",
      subtitle: "Absolute Alpha Overlord",
      priceWeekly: "5.99",
      priceMonthly: "19.99",
      priceYearly: "99.00",
      features: [
        "Satellite proxy telemetry sync",
        "Continuous AI training engines",
        "Real-time recomp forecasts",
        "Full developer API export keys"
      ],
      badge: "COMING SOON",
      available: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsPaywallOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0A0A] border border-[#FF5F15]/40 rounded-2xl w-full max-w-4xl p-5 md:p-6 relative shadow-[0_0_50px_rgba(255,95,21,0.25)] overflow-y-auto max-h-[90vh]"
      >
        <button
          type="button"
          onClick={() => setIsPaywallOpen(false)}
          className="absolute top-4 right-4 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-[#FF5F15] p-1.5 rounded-lg transition-all cursor-pointer"
          title="Dismiss Paywall"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 border-b border-white/10 pb-3 mb-5">
          <div className="w-9 h-9 rounded bg-[#FF5F15]/10 border border-[#FF5F15]/30 flex items-center justify-center text-[#FF5F15]">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white uppercase tracking-wider text-base">Radical Protocol Upgrade Gate</h3>
            <p className="text-[10px] text-zinc-400 font-mono">FIVE RADICAL TIERS ● ACTIVE STATUS VERIFIED</p>
          </div>
        </div>

        {/* Billing Cycle Selector */}
        <div className="flex flex-col items-center justify-center mb-6 space-y-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">SELECT RECOMP BILLING RESOLUTION</span>
          <div className="bg-zinc-950 border border-white/5 p-1 rounded-xl flex gap-1.5">
            {[
              { val: "weekly", label: "Weekly Core", desc: "Slightly costlier" },
              { val: "monthly", label: "Monthly Std", desc: "Max $19.99/mo Limit" },
              { val: "yearly", label: "Yearly Discount", desc: "$99/yr Mega Discount" }
            ].map((cycle) => (
              <button
                key={cycle.val}
                type="button"
                onClick={() => setBillingCycle(cycle.val as any)}
                className={`px-4 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider font-extrabold transition-all cursor-pointer text-center ${
                  billingCycle === cycle.val
                    ? "bg-[#FF5F15] text-black shadow-lg"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <div>{cycle.label}</div>
                <div className="text-[7px] opacity-80 lowercase italic font-light tracking-tight leading-none mt-0.5">{cycle.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {planTiers.map((planItem) => {
            const isSelected = selectedPlanId === planItem.name;
            const displayPrice = billingCycle === "weekly" ? planItem.priceWeekly : billingCycle === "monthly" ? planItem.priceMonthly : planItem.priceYearly;
            const periodText = billingCycle === "weekly" ? "wk" : billingCycle === "monthly" ? "mo" : "yr";

            return (
              <div
                key={planItem.name}
                onClick={() => {
                  if (planItem.available) {
                    setSelectedPlanId(planItem.name);
                  }
                }}
                className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-[#FF5F15] bg-zinc-950/90 shadow-[0_0_20px_rgba(255,95,21,0.15)] scale-[1.02]"
                    : planItem.available
                    ? "border-white/5 bg-zinc-900/10 hover:border-white/15"
                    : "border-white/5 bg-zinc-950/20 opacity-60 cursor-not-allowed"
                }`}
              >
                {planItem.badge && (
                  <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[7px] font-mono font-black px-2 py-0.5 rounded-full border bg-[#050505] tracking-widest ${
                    planItem.name === "Free" ? "text-cyan-400 border-cyan-500/30" : "text-zinc-500 border-white/5"
                  }`}>
                    {planItem.badge}
                  </span>
                )}

                <div className="space-y-3.5">
                  <div>
                    <h4 className="font-black text-xs text-white uppercase tracking-wider leading-tight">{planItem.name}</h4>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">{planItem.subtitle}</p>
                  </div>

                  <div className="py-2 border-y border-dashed border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black font-mono text-white">${displayPrice}</span>
                      <span className="text-[8px] font-mono text-zinc-500 uppercase">/{periodText}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-[8px] font-mono text-zinc-400">
                    {planItem.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <span className="text-[#FF5F15]">✔</span>
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    disabled={!planItem.available}
                    className={`w-full text-center text-[8.5px] font-mono font-black uppercase py-1.5 rounded-md tracking-wider transition-all border-none ${
                      isSelected
                        ? "bg-[#FF5F15] text-black"
                        : planItem.available
                        ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                        : "bg-zinc-950 text-zinc-650 cursor-not-allowed"
                    }`}
                  >
                    {isSelected ? "ACTIVE TIER" : planItem.available ? "SELECT TIER" : "UNAVAILABLE"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-zinc-900/40 border border-white/5 rounded-xl flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-[#FF5F15] shrink-0" />
          <p className="text-xs text-zinc-400 font-mono">
            RADICAL MVP SUBSCRIPTION VERIFICATION PROTOCOL: Paid tiers are currently in physical staging/development phase. Select "Free" to confirm operational enlistment.
          </p>
        </div>

        {/* Action Bar */}
        <div className="mt-6 border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">Selected Operational Configuration</span>
            <p className="text-xs text-white font-extrabold uppercase mt-0.5">
              {selectedPlanId} — {billingCycle} cycle ($0.00 USD)
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedPlanId === "Free") {
                setUserTier("Free");
                setIsPaywallOpen(false);
                setTriggerCelebration(true);
              }
            }}
            className="bg-[#FF5F15] hover:bg-orange-600 text-black font-black text-xs px-6 py-3 rounded-lg uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#FF5F15]/10"
          >
            Confirm Enrollment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
