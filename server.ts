import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Create rate limiters
const planLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: { error: "Too many plan generation requests from this IP. Please try again after a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: { error: "Too many chat messages from this IP. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

const reportLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: { error: "Too many report generation requests from this IP. Please try again after a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. API features will fail gracefully.");
      // We will throw error inside the endpoint to fail gracefully
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_PREVIEW",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API Endpoint: Generate Custom Radical Plan
app.post("/api/generate-plan", planLimiter, async (req, res) => {
  try {
    const { 
      age, weight, height, trainingLevel, dietPreference, focusGoal,
      operationalLoad, vulnerabilities, availableHardware, chronoAllocation, fuelingProtocol,
      addictions, sleepHabits, dailyStepCount, portionSizeMealFrequency, specialDiets
    } = req.body;

    if (!age || !weight || !height || !trainingLevel || !dietPreference) {
      return res.status(400).json({ error: "Missing required profile parameters" });
    }

    const parsedAge = parseInt(age);
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);

    if (isNaN(parsedAge) || parsedAge < 13 || parsedAge > 120) {
      return res.status(400).json({ error: "Invalid age. Age must be between 13 and 120." });
    }
    if (isNaN(parsedWeight) || parsedWeight < 20 || parsedWeight > 500) {
      return res.status(400).json({ error: "Invalid weight. Weight must be between 20 and 500 kg." });
    }
    if (isNaN(parsedHeight) || parsedHeight < 50 || parsedHeight > 300) {
      return res.status(400).json({ error: "Invalid height. Height must be between 50 and 300 cm." });
    }
    const validLevels = ["Beginner", "Intermediate", "Advanced"];
    if (!validLevels.includes(trainingLevel)) {
      return res.status(400).json({ error: "Invalid training level." });
    }
    const validDiets = ["Carnivore", "Keto", "Low-carb", "Diet cycling"];
    if (!validDiets.includes(dietPreference)) {
      return res.status(400).json({ error: "Invalid diet preference." });
    }
    
    const sanitizedGoal = typeof focusGoal === "string" 
      ? focusGoal.replace(/<[^>]*>/g, "").substring(0, 500) 
      : "Overall Health & recomposition";

    if (!process.env.GEMINI_API_KEY) {
      // Return a simulated, high-quality fall-back plan so the app still functions if no key is supplied
      return res.json(getFallbackPlan(dietPreference, trainingLevel));
    }

    const ai = getGenAI();

    const systemInstruction = `
You are the elite "RADICAL" system training advisor. RADICAL is a civilian pop fitness transformation system built on the Radical Triangle: Fitness (Zone 2, Strength, Conditioning), Diet (Keto, Carnivore, Low-carb, or Diet cycling), and Habits (quit tobacco/liquor/drugs/negative company, sleep discipline, hydration, etc.).
No military drills or combat roleplay. Professional, science-based civil optimization only.
Generate a structured fitness transformation plan for the user based on their specs.
Return the output EXACTLY conforming to the JSON schema requested. Give highly realistic, motivating, scientifically sound recommendations.
`;

    const userPrompt = `
Generate a science-backed Radical transformation plan for this individual:
- Age: ${age} years old
- Weight: ${weight} kg
- Height: ${height} cm
- Training Experience Level: ${trainingLevel}
- Nutrition Choice: ${dietPreference}
- Primary Transformation Goal: ${sanitizedGoal}

SECTION 02: SYSTEM BIOMETRICS & RESOURCE CALIBRATION
- Current Operational Load (Baseline Capacity): ${operationalLoad || "Active"}
- Biomechanical Vulnerabilities: ${JSON.stringify(vulnerabilities || ["None"])}
- Tactical Asset Deployment (Available Hardware): ${availableHardware || "Full Gym"}
- Chrono-Allocation (Operational Window): ${chronoAllocation || "Standard"}
- Bioenergetic Fueling Protocol: ${fuelingProtocol || "Lipolytic"}

LIFESTYLE BASELINE PARAMETERS
- Addictions / Substance Vices: ${JSON.stringify(addictions || [])}
- Sleep Habits: ${sleepHabits || "8 hours"}
- Current Daily Step Count: ${dailyStepCount || "10000"} steps
- Portion Size & Meal Frequency: ${portionSizeMealFrequency || "Small portions & 4-6 meals"}
- Special Diets (Current/Past): ${specialDiets || "None"}

The plan must define clear actions for:
1. Radical Fitness:
   - Zone 2 Aerobic Training (stamina, fat-burning engine. Adapt to their Current Operational Load and Chrono-Allocation).
   - Strength Training (muscle, metabolism, posture. Adapt strictly to their Biomechanical Vulnerabilities by specifying exercises that bypass structural constraints, and utilize only their Available Hardware).
   - Conditioning (high energy, athletic capability. Customize based on Chrono-Allocation and Baseline Capacity).
2. Radical Diet:
   - Customized regimen incorporating their Bioenergetic Fueling Protocol and Special Diets. Structure custom daily meals ideas matching their Portion Size and Meal Frequency preferences.
3. Radical Habits:
   - Actionable adjustments to sleep, hydration, and steps targets, specifically addressing their substance use/addictions, sleep habits, and daily step count.
4. An empowering, direct Radical motivation statement.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fitnessPlan: {
              type: Type.OBJECT,
              properties: {
                zone2Desc: { 
                  type: Type.STRING, 
                  description: "Scientific explanation of Zone 2 training specifically customized for this user profile." 
                },
                zone2Workouts: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "3 highly actionable, science-based Zone 2 exercises or regimens for the week." 
                },
                strengthDesc: { 
                  type: Type.STRING,
                  description: "Focus areas for Strength training based on experience level."
                },
                strengthWorkouts: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "3 highly structured strength workouts targeting primary compound movements."
                },
                conditioningDesc: { 
                  type: Type.STRING,
                  description: "Core objective of metabolic work and how to execute it safely without extreme drills."
                },
                conditioningWorkouts: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "2 custom-designed conditioning finishers or metabolic sessions."
                }
              },
              required: ["zone2Desc", "zone2Workouts", "strengthDesc", "strengthWorkouts", "conditioningDesc", "conditioningWorkouts"]
            },
            dietPlan: {
              type: Type.OBJECT,
              properties: {
                regimenName: { type: Type.STRING, description: "Name of the customized diet: e.g., 'Targeted Keto Protocol' or 'Carnivore Adaptation Phase'." },
                philosophy: { type: Type.STRING, description: "The science of how this diet fuels their recomposition and supports lean mass." },
                meals: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Four specific meal structures (Breakfast, Lunch, Dinner, Snack/Pre-workout) that suit this selected protocol."
                },
                tips: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "3 tactical tips for meal prep, transition symptoms, or consistency."
                }
              },
              required: ["regimenName", "philosophy", "meals", "tips"]
            },
            habitsPlan: {
              type: Type.OBJECT,
              properties: {
                focusAreas: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "2-3 primary non-negotiable habits to target (e.g., Sleep, Hydration, Media detox, Substance restrictions)."
                },
                actionSteps: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "3 very specific habitual action points they must do daily (e.g. 10k steps, 3.5L water, lights out at 22:00)." 
                },
                tips: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Advice on building mental steel and avoiding sliding back into soft patterns." 
                }
              },
              required: ["focusAreas", "actionSteps", "tips"]
            },
            motivationQuote: { 
              type: Type.STRING, 
              description: "A strong, brief, elite but helpful Radical motivation statement." 
            }
          },
          required: ["fitnessPlan", "dietPlan", "habitsPlan", "motivationQuote"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response received from Gemini API");
    }

    const plan = JSON.parse(resultText.trim());
    return res.json(plan);

  } catch (error: any) {
    console.error("Error in /api/generate-plan:", error);
    // Return standard fallback in case of errors
    return res.status(500).json({ 
      error: "Failed to generate plan via Gemini", 
      details: "An unexpected error occurred during plan generation. Please try again.",
      fallback: getFallbackPlan(req.body.dietPreference || "Keto", req.body.trainingLevel || "Intermediate")
    });
  }
});
// 2. API Endpoint: Coach Chat
app.post("/api/coach-chat", chatLimiter, async (req, res) => {
  try {
    const { messages, userProfile } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length > 50) {
      return res.status(400).json({ error: "Invalid messages array. Max 50 messages allowed." });
    }

    const validatedMessages = [];
    for (const msg of messages) {
      if (!msg || typeof msg !== "object" || typeof msg.text !== "string" || (msg.sender !== "user" && msg.sender !== "model")) {
        return res.status(400).json({ error: "Invalid message format." });
      }
      validatedMessages.push({
        sender: msg.sender,
        text: msg.text.substring(0, 2000)
      });
    }

    const safeProfile: any = {};
    if (userProfile && typeof userProfile === "object") {
      const allowedKeys = ["name", "age", "weight", "height", "trainingLevel", "dietPreference", "focusGoal"];
      for (const key of allowedKeys) {
        if (userProfile[key] !== undefined) {
          safeProfile[key] = String(userProfile[key]).replace(/<[^>]*>/g, "").substring(0, 200);
        }
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      const lastMsg = validatedMessages[validatedMessages.length - 1]?.text?.toLowerCase() || "";
      let coachResponse = "Let's dial in the Radical principles. Tell me more about your struggle with fitness, diet, or daily habits. Remember: consistency is the true force multiplier.";
      if (lastMsg.includes("diet") || lastMsg.includes("eat") || lastMsg.includes("keto") || lastMsg.includes("carnivore")) {
        coachResponse = "For Diet, whether keto, low-carb, or carnivore, pure simplification is your weapon. Avoid fancy artificial substitute snacks. Stick to pasture-raised eggs, clean meats, and healthy fats. What's your current biggest obstacle in staying clean on meals?";
      } else if (lastMsg.includes("exercise") || lastMsg.includes("workout") || lastMsg.includes("cardio") || lastMsg.includes("zone")) {
        coachResponse = "Zone 2 aerobic base is non-negotiable. It builds the cellular engine (mitochondria) so you run cooler and burn fat at higher intensities. Keep your heart rate at a conversational level. For strength, focus on raw form on squats, row, and presses. Are you hitting these targets?";
      } else if (lastMsg.includes("sleep") || lastMsg.includes("habit") || lastMsg.includes("alcohol") || lastMsg.includes("smoking")) {
        coachResponse = "Habits are the glue of the Radical Triangle. Sleep is where the nervous system and muscles rebuild. Ban screens 1 hour before bed. Hydrate with sea salt in water first thing in the morning. Cut out the poisonous associations—media, negative company, or toxic cycles. Stand firm.";
      }
      return res.json({ text: coachResponse });
    }

    const ai = getGenAI();

    const formattedContents = validatedMessages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const systemInstruction = `
You are the RADICAL AI Transformer Coach. You speak directly, scientifically, with exceptional support but an absolute expectation of discipline.
No military gimmicks, no screaming, no tactical roleplay. You are a high-status corporate/elite performance coach who values facts, biochemistry, sleep hygiene, and compound movements.
The user's stats: ${JSON.stringify(safeProfile)}.
Always keep your answers structured, actionable, and encouraging but firm. Give clear science-backed tips for Zone 2, Keto/Carnivore nutrition, and daily rigid habit routines. Keep responses concise (under 120 words).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
      }
    });

    return res.json({ text: response.text });

  } catch (error: any) {
    console.error("Error in /api/coach-chat:", error);
    return res.status(500).json({ error: "Failed to communicate with AI Coach", details: "An unexpected error occurred. Please try again." });
  }
});
// 2.5 API Endpoint: Generate 7-Day Performance Report
app.post("/api/generate-weekly-report", reportLimiter, async (req, res) => {
  try {
    const { 
      userProfile, 
      weeklyWorkouts, 
      weeklySteps, 
      weeklyHabits, 
      dietLog 
    } = req.body;

    const safeProfile: any = {};
    if (userProfile && typeof userProfile === "object") {
      const allowedKeys = ["name", "age", "weight", "height", "trainingLevel", "dietPreference", "focusGoal"];
      for (const key of allowedKeys) {
        if (userProfile[key] !== undefined) {
          safeProfile[key] = String(userProfile[key]).replace(/<[^>]*>/g, "").substring(0, 200);
        }
      }
    }

    if (weeklyWorkouts && (!Array.isArray(weeklyWorkouts) || weeklyWorkouts.length > 100)) {
      return res.status(400).json({ error: "Invalid weeklyWorkouts input" });
    }
    const safeWorkouts = Array.isArray(weeklyWorkouts) ? weeklyWorkouts.map((w: any) => ({
      completed: !!w.completed,
      date: String(w.date || "").substring(0, 50),
      type: String(w.type || "").substring(0, 50),
      name: String(w.name || "").substring(0, 100)
    })) : [];

    if (weeklySteps && (!Array.isArray(weeklySteps) || weeklySteps.length > 100)) {
      return res.status(400).json({ error: "Invalid weeklySteps input" });
    }
    const safeSteps = Array.isArray(weeklySteps) ? weeklySteps.map((s: any) => ({
      date: String(s.date || "").substring(0, 50),
      count: isNaN(parseInt(s.count)) ? 0 : Math.max(0, parseInt(s.count))
    })) : [];

    if (weeklyHabits && (!Array.isArray(weeklyHabits) || weeklyHabits.length > 100)) {
      return res.status(400).json({ error: "Invalid weeklyHabits input" });
    }
    const safeHabits = Array.isArray(weeklyHabits) ? weeklyHabits.map((h: any) => ({
      date: String(h.date || "").substring(0, 50),
      count: isNaN(parseInt(h.count)) ? 0 : Math.max(0, parseInt(h.count))
    })) : [];

    const safeDietLog: any = {};
    if (dietLog && typeof dietLog === "object") {
      safeDietLog.breakfastChecked = !!dietLog.breakfastChecked;
      safeDietLog.lunchChecked = !!dietLog.lunchChecked;
      safeDietLog.dinnerChecked = !!dietLog.dinnerChecked;
      safeDietLog.waterGlasses = isNaN(parseInt(dietLog.waterGlasses || dietLog.waterOunces)) 
        ? 0 
        : Math.max(0, parseInt(dietLog.waterGlasses || dietLog.waterOunces));
    }

    // Define fallback generator if no API key is supplied
    const generateFallbackReport = () => {
      const avgWorkouts = safeWorkouts.length ? Math.round((safeWorkouts.filter((w: any) => w.completed).length / safeWorkouts.length) * 100) : 60;
      const totalSteps = safeSteps.reduce((acc: number, val: any) => acc + (val.count || 0), 0);
      const avgSteps = safeSteps.length ? Math.round(totalSteps / safeSteps.length) : 11000;
      const avgHabits = safeHabits.length ? Math.round((safeHabits.reduce((acc: number, val: any) => acc + (val.count || 0), 0) / safeHabits.length) * 10) / 10 : 4.8;
      const waterDaily = safeDietLog?.waterGlasses ? safeDietLog.waterGlasses : 8;
      
      const overallStatus = avgWorkouts >= 75 && avgSteps >= 11000 && avgHabits >= 4.5 ? "PERFORMANCE: OPTIMIZED" : "PERFORMANCE: BALANCED";

      return `### RADICAL 7-DAY BLOCK PERFORMANCE ANALYSIS
**CYCLE MONITORING INDEX: SEVEN-DAY METABOLIC PHASE**

---

#### 📊 DETECTED OPERATIONAL METRICS:
* **Fitness Completion Capacity**: **${avgWorkouts}%** (Workouts completed vs scheduled)
* **Aerobic Step Load**: **${avgSteps.toLocaleString()} daily steps average** (Cumulative: **${totalSteps.toLocaleString()} steps**)
* **Habitual Discipline Index**: **${avgHabits} / 6 daily rules checked**
* **Hydration Status**: **${waterDaily} / 8 glasses registered**

---

#### 🔱 1. PHYSIOLOGICAL & CELLULAR ENDURANCE RECONSTRUCTION
Your aerobic output index is averaged at **${avgSteps.toLocaleString()} steps per day**. Operating at this level activates steady-state mitochondrial biogenesis, meaning your body is running a highly efficient fatty acid transport sequence. For the fitness regime of **${safeProfile?.trainingLevel || "Intermediate"}** rank, this builds a durable heart rate recovery buffer, letting you clear lactic acid at high efficiencies. 
* *Tactical recommendation*: Maintain this solid 10,000–12,000 steps range. Rucking or incline pacing can intensify the active caloric burn without loading your knee joint capsules excessively.

#### 🥬 2. MACRONUTRIENT & METABOLIC COMPLIANCE REVIEW
With your chosen **${safeProfile?.dietPreference || "Low-Carb"}** baseline, strict glycemic control is the primary asset. By keeping starch content low, your liver is releasing a steady profile profile of clean acetyl-coenzyme A molecules. 
* Today's check-in shows Breakfast: ${safeDietLog?.breakfastChecked ? "Clean" : "Unlogged"}, Lunch: ${safeDietLog?.lunchChecked ? "Clean" : "Unlogged"}, Dinner: ${safeDietLog?.dinnerChecked ? "Clean" : "Unlogged"}.
* *Liquid Hydration*: Recording **${waterDaily} glasses of water**. Proper hydration prevents cortisol hikes and helps maintain intracellular fluid tension. Continue targeting an 8 glass standard with natural mineral balance.

#### 🛡️ 3. CONTROLLABLE HABITS & DISCIPLINE CORRELATIONS
With an adherence score of **${avgHabits} out of 6 active habits completed**, you are enforcing a robust psychological container that limits decision fatigue.
* *Sleep & Substance Hygiene*: Consistently checking negative company, sleep schedules, or toxic vices completely prevents central nervous system exhaustion. The chemistry is simple: fewer toxic compounds in your circulation translates to clean deep sleep and accelerated muscle fiber reconstruction.

#### 🎯 AI COACH SUMMARY VERDICT
**STATUS: ${overallStatus}**
*"You are adapting perfectly to the metabolic guidelines. Cellular stamina is built on strict non-negotiable blocks of daily routine. Treat hydration, steps, and heavy squats as part of your biological operational checklist. Continue standard tracking, stay firm, and command your progression."*`;
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ text: generateFallbackReport() });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are the senior RADICAL AI Science-Based Performance Analyst, conducting a cyclical 7-day metabolic review.
Analyze the user's weekly metrics across Fitness, Diet, and Habits with surgical precision, utilizing rich chemical, anatomical, and athletic terminology (e.g. glycogen depletion, mitochondrial density, insulin sensitivity, central nervous system load, compound recruitment, habit stabilization loops).
Speak directly with ultimate elite authority but exceptional mentorship. Do not indulge in cheesy military roleplay or screaming. 
Structure your response in markdown format with headings:
- **RADICAL 7-DAY BLOCK PERFORMANCE ANALYSIS**
- **📊 DETECTED OPERATIONAL METRICS** (List their stats with bold bullets)
- **🔱 1. PHYSIOLOGICAL & CELLULAR ENDURANCE RECONSTRUCTION** (Analyze workouts & steps)
- **🥬 2. MACRONUTRIENT & METABOLIC COMPLIANCE REVIEW** (Analyze diet preference & hydration)
- **🛡️ 3. CONTROLLABLE HABITS & DISCIPLINE CORRELATIONS** (Analyze checked habits & streaks)
- **🎯 AI COACH SUMMARY VERDICT** (A solid, direct closing judgment)
`;

    const userPrompt = `
Generate a comprehensive 7-day performance report for this user:
- User Profile: ${JSON.stringify(safeProfile)}
- 7-Day Workouts Logged: ${JSON.stringify(safeWorkouts)}
- 7-Day Daily Steps Logged: ${JSON.stringify(safeSteps)}
- 7-Day Daily Habits Checked Logged: ${JSON.stringify(safeHabits)}
- Active Diet Hydration Stats: ${JSON.stringify(safeDietLog)}

Provide highly realistic athletic feedback, pointing out areas of high discipline (e.g. high step compliance, workout frequency) and specific bio-backed recommendations to handle lapses. Ensure it looks outstanding and is informative.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
      }
    });

    return res.json({ text: response.text });

  } catch (error: any) {
    console.error("Error in /api/generate-weekly-report:", error);
    return res.status(500).json({ error: "Failed to generate weekly report", details: "An unexpected error occurred during report generation. Please try again." });
  }
});

// Mock/fallback plans helper
function getFallbackPlan(diet: string, level: string) {
  return {
    fitnessPlan: {
      zone2Desc: `Continuous low-intensity aerobic activity at 60-70% of max Heart Rate. This zone maximizes fatty acid oxidation and acts as the structural foundation of your cardiovascular system. Designed for ${level} level.`,
      zone2Workouts: [
        "Incline Rucking: 40-minute fast paced walk on a steady incline, keeping heart rate in conversational range.",
        "Zone 2 Cycling: 45 minutes of flat terrain road biking with a constant pedal cadence of 80-90 RPM.",
        "Steady-State Rowing/Swimming: 35 minutes continuous light pacing focusing on rhythmic breathing."
      ],
      strengthDesc: `Focus on progressive overloading on major movement patterns: Push, Pull, Squat, and Hinge, styled for a science-based ${level} trainer.`,
      strengthWorkouts: [
        "Strength A (Squat & Press): Barbell Back Squats (4 sets x 6 reps), Overhead Press (3 sets x 8 reps), Pull-ups (4 sets to near-failure).",
        "Strength B (Hinge & Pull): Deadlifts or Romanian Deadlifts (3 sets x 5 reps), Bent-Over Barbell Rows (4 sets x 8 reps), Incline Dumbbell Press (3 sets x 10 reps).",
        "Strength C (Unilateral & Core): Bulgarian Split Squats (3 sets x 8 per leg), Overhead Dumbbell Carries (3 sets x 50 meters), Hanging Leg Raises (3 sets x 12 reps)."
      ],
      conditioningDesc: "Efficient metabolic energy pathway training. This enhances the lactic threshold and burns extra glycogen reserves without over-taxing joints.",
      conditioningWorkouts: [
        "Sled Push/Pull Finishers: 6 rounds of 30-meter heavy prowling with a 1:1 work-to-rest ratio.",
        "Kettlebell Conditioning: 8 rounds of 20 kettlebell swings immediately followed by 10 burpees, rest 60 seconds."
      ]
    },
    dietPlan: {
      regimenName: `${diet} High-Status Regime`,
      philosophy: `The Radical Diet fuels clean physical output. Choosing a ${diet} baseline forces the body to shed inflammatory foods, manage blood sugar volatility, and mobilize stored body fat as real fuel.`,
      meals: [
        "Breakfast/Fuel 1: 4 large pasture-raised eggs cooked in grass-fed butter, with a side of dry bacon or prime steak strips.",
        "Lunch/Fuel 2: Ground beef patties (80/20) or grilled salmon served with cold-pressed olive oil, light sea-salt, and selected greens.",
        "Dinner/Fuel 3: Slow-cooked beef ribeye or roasted chicken thighs with mineral broth.",
        "Snack/Supplement: Bulletproof espresso with grass-fed ghee, or organic beef jerky with pure hydration salts."
      ],
      tips: [
        "Electrolytes are critical: Supplement with high-quality sodium, potassium, and magnesium during the first 14 days.",
        "Eliminate processed fats: Rely strictly on tallow, butter, ghee, extra virgin olive oil, and avocado oil. Zero seed oils.",
        "Dine on absolute block schedules: Set a strict 8-hour feeding window to boost insulin sensitivity."
      ]
    },
    habitsPlan: {
      focusAreas: [
        "Nervous System Reset: Strict sleep latency control to maximize deep REM sleep.",
        "Absolute Avoidance: Complete tactical exclusion of lifestyle poisons (sugar, alcohol, vaping, toxic networks)."
      ],
      actionSteps: [
        "Wake Up Protocol: Drink 500ml of mineralized water and look directly at first daylight for 10 minutes.",
        "Step Discipline: Secure a non-negotiable minimum of 10,000 steps daily to promote non-exercise physical activity.",
        "Blue-Light Blockage: Disconnect all screens or light filters exactly 1 hour before scheduled sleep."
      ],
      tips: [
        "Identity is everything. You don't 'try to stop drinking'—you do not drink. Treat clean habits as a biological operational order.",
        "Do not negotiate details post 9 PM. Executive decision fatigue is real. Rely on preset schedules."
      ]
    },
    motivationQuote: "The Radical identity is your force-multiplier. The science is your weapon. Stand firm, do the work, and command your own transformation."
  };
}

// 3. Vite development vs production server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite middleware
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RADICAL fitness system active at: http://localhost:${PORT}`);
  });
}

startServer();
