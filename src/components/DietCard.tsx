import React from "react";
import { 
  Apple, 
  Check, 
  Droplet 
} from "lucide-react";
import { useCommando } from "../context/CommandoContext";

export default function DietCard() {
  const { state, setDietLog, setDashboardPage } = useCommando();
  const { 
    dietLog, 
    plan, 
    dashboardPage 
  } = state;

  if (!plan) return null;

  const isDietPage = dashboardPage === "diet";

  return (
    <section 
      className={`bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-[#FF5F15]/20 transition-all duration-300 ${
        isDietPage ? "lg:col-span-3 border-[#FF5F15]/30 shadow-[0_0_40px_rgba(255,95,21,0.08)]" : "lg:col-span-1"
      }`}
      aria-label="Dietary protocol tracking"
    >
      <div>
        <div className="flex justify-between items-center border-b border-white/15 pb-4 mb-4">
          <div className="flex-1 flex justify-between items-start">
            <div>
              <span className="text-[#FF5F15] font-mono text-xs font-bold uppercase tracking-widest">02 / PHYSIOLOGICAL FUEL</span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-white flex items-center gap-1.5 flex-wrap">
                Dietary Protocol
                {isDietPage && (
                  <span className="text-[9px] font-mono font-black italic bg-[#FF5F15]/15 text-[#FF5F15] px-2 py-0.5 rounded border border-[#FF5F15]/30">
                    PAGE ACTIVE
                  </span>
                )}
              </h3>
            </div>
            {dashboardPage === "overview" ? (
              <button
                onClick={() => setDashboardPage("diet")}
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
            <Apple className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-4 bg-zinc-900/40 p-3 rounded-lg border border-white/5 leading-normal">
          <strong>Philosophy &amp; Engine:</strong> {plan.dietPlan.philosophy}
        </p>

        {/* Meal structure blocks */}
        <div className="space-y-2.5 mb-6">
          <div className="text-[10px] tracking-wider uppercase font-mono text-zinc-500 font-bold">Planned Meal Structures</div>
          
          {isDietPage ? (
            /* Render 7-day Horizontal Plan Grid */
            <div className="space-y-3 font-mono text-[10px] overflow-x-auto">
              <div className="min-w-[650px] border border-white/10 rounded-xl overflow-hidden bg-zinc-950/60">
                {/* Header row */}
                <div className="grid grid-cols-5 gap-2 p-2 border-b border-white/10 bg-zinc-900/60 font-black text-zinc-400 uppercase tracking-widest">
                  <div>Day</div>
                  <div>Fuel 1 (25%)</div>
                  <div>Fuel 2 (25%)</div>
                  <div>Fuel 3 (30%)</div>
                  <div>Fuel 4 (20%)</div>
                </div>

                {/* Carnivore 7-Day Matrix */}
                {plan.dietPlan.regimenName.toLowerCase().includes("carnivore") && [
                  { d: "Mon", f1: "Cheese Omelet (4 eggs + cheddar) [550 kcal]", f2: "Beef burgers (80/20 patties) [550 kcal]", f3: "Ribeye steak + bone marrow [660 kcal]", f4: "Bacon strips + hard eggs [440 kcal]" },
                  { d: "Tue", f1: "Scrambled eggs in butter [550 kcal]", f2: "Ribeye steak strips [550 kcal]", f3: "New York strip steak [660 kcal]", f4: "Beef liver bites [440 kcal]" },
                  { d: "Wed", f1: "Chicken liver pate + butter [550 kcal]", f2: "Beef bone marrow broth [550 kcal]", f3: "Lamb chops grilled [660 kcal]", f4: "Beef jerky snacks [440 kcal]" },
                  { d: "Thu", f1: "Cheese Omelet (butter) [550 kcal]", f2: "Ground beef bowl [550 kcal]", f3: "Ribeye steak [660 kcal]", f4: "Pork belly crisp [440 kcal]" },
                  { d: "Fri", f1: "Scrambled eggs + ghee [550 kcal]", f2: "Grilled salmon fillets [550 kcal]", f3: "Beef brisket slow-cook [660 kcal]", f4: "Boiled eggs + salt [440 kcal]" },
                  { d: "Sat (Refeed)", f1: "Sweet potato hash + eggs [550 kcal]", f2: "Roasted squash + beef [550 kcal]", f3: "Ribeye steak + rice bowl [660 kcal]", f4: "Honey glazed bacon [440 kcal]" },
                  { d: "Sun", f1: "Fasting Window / Clean TRE", f2: "Beef bone broth [550 kcal]", f3: "Lamb rib racks [660 kcal]", f4: "Pemmican bites [440 kcal]" }
                ].map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-5 gap-2 p-2 border-b border-white/5 hover:bg-white/5 text-zinc-300">
                    <div className="font-bold text-[#FF5F15]">{row.d}</div>
                    <div>{row.f1}</div>
                    <div>{row.f2}</div>
                    <div>{row.f3}</div>
                    <div>{row.f4}</div>
                  </div>
                ))}

                {/* Keto 7-Day Matrix */}
                {plan.dietPlan.regimenName.toLowerCase().includes("keto") && [
                  { d: "Mon", f1: "Cheese Omelet (spinach) [550 kcal]", f2: "Avocado & bacon salad [550 kcal]", f3: "Chicken thighs in olive oil [660 kcal]", f4: "Almond butter celery [440 kcal]" },
                  { d: "Tue", f1: "Keto butter coffee + eggs [550 kcal]", f2: "Tuna salad + olive oil [550 kcal]", f3: "Beef sirloin + asparagus [660 kcal]", f4: "Macadamia nuts pack [440 kcal]" },
                  { d: "Wed", f1: "Cheese Omelet (cheddar) [550 kcal]", f2: "Pork chops + broccoli [550 kcal]", f3: "Salmon fillet + ghee [660 kcal]", f4: "MCT oil cocoa shake [440 kcal]" },
                  { d: "Thu", f1: "Scrambled eggs + avocado [550 kcal]", f2: "Chicken wings roasted [550 kcal]", f3: "Ribeye steak + greens [660 kcal]", f4: "Coconut butter bites [440 kcal]" },
                  { d: "Fri", f1: "Cheese Omelet (spinach) [550 kcal]", f2: "Caesar salad with bacon [550 kcal]", f3: "Beef meatballs in butter [660 kcal]", f4: "Hard boiled eggs [440 kcal]" },
                  { d: "Sat (Refeed)", f1: "Oats + berries + eggs [550 kcal]", f2: "Sweet potato bowl + tuna [550 kcal]", f3: "Chicken breast + white rice [660 kcal]", f4: "Sourdough toast slice [440 kcal]" },
                  { d: "Sun", f1: "Fasting Window / Clean TRE", f2: "Bone broth + butter [550 kcal]", f3: "Salmon fillet + asparagus [660 kcal]", f4: "Walnut snacks [440 kcal]" }
                ].map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-5 gap-2 p-2 border-b border-white/5 hover:bg-white/5 text-zinc-300">
                    <div className="font-bold text-[#FF5F15]">{row.d}</div>
                    <div>{row.f1}</div>
                    <div>{row.f2}</div>
                    <div>{row.f3}</div>
                    <div>{row.f4}</div>
                  </div>
                ))}

                {/* Low-Carb 7-Day Matrix */}
                {plan.dietPlan.regimenName.toLowerCase().includes("low-carb") && [
                  { d: "Mon", f1: "Eggs scrambled with tomato [550 kcal]", f2: "Chicken salad (olive oil) [550 kcal]", f3: "Salmon + steamed broccoli [660 kcal]", f4: "Greek yogurt + berries [440 kcal]" },
                  { d: "Tue", f1: "Turkey bacon & egg cups [550 kcal]", f2: "Beef stir-fry with peppers [550 kcal]", f3: "Tuna steaks + green salad [660 kcal]", f4: "Mixed nut assortment [440 kcal]" },
                  { d: "Wed", f1: "Cheese Omelet (mushrooms) [550 kcal]", f2: "Shrimp salad + avocado [550 kcal]", f3: "Chicken breast + zucchini [660 kcal]", f4: "Cottage cheese snack [440 kcal]" },
                  { d: "Thu", f1: "Scrambled eggs + avocado [550 kcal]", f2: "Ground turkey bowl [550 kcal]", f3: "Pork chops + asparagus [660 kcal]", f4: "Pumpkin seeds dry [440 kcal]" },
                  { d: "Fri", f1: "Protein shake + berries [550 kcal]", f2: "Cod fillet + green beans [550 kcal]", f3: "Beef sirloin + salad [660 kcal]", f4: "Hard boiled eggs [440 kcal]" },
                  { d: "Sat (Refeed)", f1: "Oats with honey + eggs [550 kcal]", f2: "Baked potato + chicken [550 kcal]", f3: "White rice + grilled fish [660 kcal]", f4: "Sourdough toast slice [440 kcal]" },
                  { d: "Sun", f1: "Fasting Window / Clean TRE", f2: "Chicken broth soup [550 kcal]", f3: "Beef brisket + asparagus [660 kcal]", f4: "Greek yogurt snack [440 kcal]" }
                ].map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-5 gap-2 p-2 border-b border-white/5 hover:bg-white/5 text-zinc-300">
                    <div className="font-bold text-[#FF5F15]">{row.d}</div>
                    <div>{row.f1}</div>
                    <div>{row.f2}</div>
                    <div>{row.f3}</div>
                    <div>{row.f4}</div>
                  </div>
                ))}

                {/* Diet Cycling 7-Day Matrix */}
                {plan.dietPlan.regimenName.toLowerCase().includes("cycling") && [
                  { d: "Mon (Keto)", f1: "Cheese Omelet (spinach) [550 kcal]", f2: "Avocado & bacon salad [550 kcal]", f3: "Chicken thighs in olive oil [660 kcal]", f4: "Almond butter celery [440 kcal]" },
                  { d: "Tue (Keto)", f1: "Keto butter coffee + eggs [550 kcal]", f2: "Tuna salad + olive oil [550 kcal]", f3: "Beef sirloin + asparagus [660 kcal]", f4: "Macadamia nuts pack [440 kcal]" },
                  { d: "Wed (Carn)", f1: "Scrambled eggs in butter [550 kcal]", f2: "Ribeye steak strips [550 kcal]", f3: "New York strip steak [660 kcal]", f4: "Beef liver bites [440 kcal]" },
                  { d: "Thu (Carn)", f1: "Cheese Omelet (butter) [550 kcal]", f2: "Ground beef bowl [550 kcal]", f3: "Ribeye steak [660 kcal]", f4: "Pork belly crisp [440 kcal]" },
                  { d: "Fri (LowCarb)", f1: "Eggs scrambled with tomato [550 kcal]", f2: "Chicken salad (olive oil) [550 kcal]", f3: "Salmon + steamed broccoli [660 kcal]", f4: "Greek yogurt + berries [440 kcal]" },
                  { d: "Sat (Refeed)", f1: "Oats with honey + eggs [550 kcal]", f2: "Sweet potato bowl + tuna [550 kcal]", f3: "White rice + grilled fish [660 kcal]", f4: "Honey glazed bacon [440 kcal]" },
                  { d: "Sun (TRE Fast)", f1: "Fasting Window / Clean TRE", f2: "Chicken broth soup [550 kcal]", f3: "Lamb rib racks [660 kcal]", f4: "Beef bone broth [440 kcal]" }
                ].map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-5 gap-2 p-2 border-b border-white/5 hover:bg-white/5 text-zinc-300">
                    <div className="font-bold text-[#FF5F15]">{row.d}</div>
                    <div>{row.f1}</div>
                    <div>{row.f2}</div>
                    <div>{row.f3}</div>
                    <div>{row.f4}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Fallback single-day logs list in overview */
            plan.dietPlan.meals.map((meal, idx) => {
              const labels = ["BREAKFAST/FUEL 1", "LUNCH/FUEL 2", "DINNER/FUEL 3", "PRE-WORKOUT/SNACK"];
              const keyPrefix = idx === 0 ? "breakfastChecked" : idx === 1 ? "lunchChecked" : idx === 2 ? "dinnerChecked" : null;
              const isChecked = keyPrefix ? (dietLog as any)[keyPrefix] : false;

              return (
                <div 
                  key={idx}
                  onClick={() => {
                    if (keyPrefix) {
                      setDietLog({
                        ...dietLog,
                        [keyPrefix]: !isChecked
                      });
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
                    isChecked 
                      ? "bg-[#FF5F15]/5 border-[#FF5F15]/20" 
                      : "bg-zinc-900/40 border-white/5 hover:border-white/10 text-zinc-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-mono text-[#FF5F15]/90 font-bold uppercase tracking-wider">
                      {labels[idx] || "NUTRITION TARGET"}
                    </span>
                    {keyPrefix && (
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isChecked ? "bg-[#FF5F15] border-[#FF5F15] text-[#0A0A0A]" : "border-zinc-700"
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                      </span>
                    )}
                  </div>
                  <p className={`font-mono text-zinc-200 text-[11px] leading-relaxed ${isChecked ? "line-through opacity-50" : ""}`}>
                    {meal}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Liquid logging */}
        <div className="bg-zinc-950/80 border border-white/5 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1"><Droplet className="text-blue-400 w-3.5 h-3.5 fill-blue-400" /> Liquid Hydration</span>
            <span className="text-[#FF5F15] font-bold">{dietLog.waterGlasses} / 8 Glasses</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
              <button
                key={g}
                onClick={() => setDietLog({ ...dietLog, waterGlasses: g })}
                className={`flex-1 h-8 rounded-lg font-mono text-xs font-bold transition-all border cursor-pointer ${
                  dietLog.waterGlasses >= g 
                    ? "bg-[#FF5F15] border-[#FF5F15] text-[#0A0A0A] shadow-[0_0_8px_rgba(255,95,21,0.25)]" 
                    : "bg-transparent border-zinc-800 hover:border-zinc-700 text-zinc-400"
                }`}
                aria-label={`Log ${g} glasses of water`}
              >
                {g}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono text-center mt-2.5">
            Include electrolyte trace-salts within first 3 glasses. No sugary sports drinks.
          </p>
        </div>

        {/* Tactical Tips footer segment */}
        <div className="border-t border-white/5 pt-4">
          <div className="text-[10px] tracking-wider uppercase font-mono text-zinc-500 mb-2 font-bold">Tactical Cooking Core Tip</div>
          <p className="text-[11px] italic font-mono text-[#FF5F15]/90 leading-relaxed">
            &ldquo;{plan.dietPlan.tips[0] || "No seed oils ever. Rely strictly on real grass-fed butter, tallow, or extra virgin olive oil."}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
