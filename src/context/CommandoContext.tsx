import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, CommandoPlan, WorkoutLog, DietLog, HabitTrackerDay, ChatMessage, BiometricLog } from "../types";

export interface CommandoState {
  profile: UserProfile | null;
  plan: CommandoPlan | null;
  workoutLogs: WorkoutLog[];
  dietLog: DietLog;
  habitState: HabitTrackerDay;
  chatMessages: ChatMessage[];
  historicalProgress: number[];
  historicalSteps: number[];
  historicalHabits: number[];
  biometricLogs: BiometricLog[];
  targetWeight: number;
  userTier: "Free" | "Tactical Private" | "Iron Sergeant" | "Apex Commander" | "Vanguard Marshal";
  billingCycle: "weekly" | "monthly" | "yearly";
  weeklyReports: string[];
  challengesMonthly: any[];
  customChallengeDone: boolean;
  activeTab: "landing" | "onboarding" | "dashboard";
  dashboardPage: "overview" | "fitness" | "diet" | "habits" | "challenges" | "tracker" | "coach" | "analytics";
  inputMsg: string;
  isCoachTyping: boolean;
  isShareModalOpen: boolean;
  isPaywallOpen: boolean;
  triggerCelebration: boolean;
  celebrationBadge: string;
  isAuthenticated: boolean;
  authEmail: string | null;
}

interface CommandoContextType {
  state: CommandoState;
  setProfile: (profile: UserProfile | null) => void;
  setPlan: (plan: CommandoPlan | null) => void;
  setWorkoutLogs: (logs: WorkoutLog[]) => void;
  setDietLog: (log: DietLog) => void;
  setHabitState: (state: HabitTrackerDay) => void;
  setChatMessages: (msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  setHistoricalProgress: (progress: number[]) => void;
  setHistoricalSteps: (steps: number[]) => void;
  setHistoricalHabits: (habits: number[]) => void;
  setBiometricLogs: (logs: BiometricLog[]) => void;
  setTargetWeight: (weight: number) => void;
  setUserTier: (tier: "Free" | "Tactical Private" | "Iron Sergeant" | "Apex Commander" | "Vanguard Marshal") => void;
  setBillingCycle: (cycle: "weekly" | "monthly" | "yearly") => void;
  setWeeklyReports: (reports: string[] | ((prev: string[]) => string[])) => void;
  setChallengesMonthly: (challenges: any[]) => void;
  setCustomChallengeDone: (done: boolean) => void;
  setActiveTab: (tab: "landing" | "onboarding" | "dashboard") => void;
  setDashboardPage: (page: "overview" | "fitness" | "diet" | "habits" | "challenges" | "tracker" | "coach" | "analytics") => void;
  setInputMsg: (msg: string) => void;
  setIsCoachTyping: (typing: boolean) => void;
  setIsShareModalOpen: (open: boolean) => void;
  setIsPaywallOpen: (open: boolean) => void;
  setTriggerCelebration: (trigger: boolean) => void;
  setCelebrationBadge: (badge: string) => void;
  resetAllData: () => void;
  signup: (email: string, pass: string) => boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const CommandoContext = createContext<CommandoContextType | undefined>(undefined);

// Default Seed Data
const defaultWorkouts: WorkoutLog[] = [
  { id: "1", date: new Date().toISOString().split("T")[0], type: "Zone 2", name: "Incline Treadmill Walk: 35 mins (conversational base)", completed: true },
  { id: "2", date: new Date().toISOString().split("T")[0], type: "Strength", name: "Squats (Compound Mechanical Tenacity): 4 sets x 8 reps", completed: false },
  { id: "3", date: new Date().toISOString().split("T")[0], type: "Conditioning", name: "Kettlebell swings finisher: 10 mins EMOM", completed: false }
];

const defaultDiet: DietLog = {
  date: new Date().toISOString().split("T")[0],
  breakfastChecked: false,
  lunchChecked: false,
  dinnerChecked: false,
  waterGlasses: 0
};

const defaultHabits: HabitTrackerDay = {
  date: new Date().toISOString().split("T")[0],
  quitSmoking: false,
  quitAlcohol: false,
  quitDrugs: false,
  quitNegativeCompany: false,
  sleepDiscipline: false,
  hydrationChecked: false,
  gymCompleted: false,
  journalingCompleted: false,
  readingCompleted: false,
  stretchProtocol: false,
  restDayObserved: false,
  saunaTherapy: false,
  coldShower: false,
  smallPortions: false,
  multipleMeals: false,
  stepsCompleted: 0
};

const defaultSeedBiometrics = [
  { id: "1", date: "2026-06-09", weight: 81.2, waist: 90, hip: 103 },
  { id: "2", date: "2026-06-11", weight: 80.8, waist: 89, hip: 102 },
  { id: "3", date: "2026-06-13", weight: 80.4, waist: 88.5, hip: 102 }
];

export function CommandoProvider({ children }: { children: React.ReactNode }) {
  // Load initial states from localStorage with safe defaults
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem("commando_profile");
    return raw ? JSON.parse(raw) : null;
  });

  const [plan, setPlanState] = useState<CommandoPlan | null>(() => {
    const raw = localStorage.getItem("commando_plan");
    return raw ? JSON.parse(raw) : null;
  });

  const [workoutLogs, setWorkoutLogsState] = useState<WorkoutLog[]>(() => {
    const raw = localStorage.getItem("commando_workouts");
    return raw ? JSON.parse(raw) : defaultWorkouts;
  });

  const [dietLog, setDietLogState] = useState<DietLog>(() => {
    const raw = localStorage.getItem("commando_diet");
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migration: support old waterOunces mapped to waterGlasses
      if (parsed.waterOunces !== undefined && parsed.waterGlasses === undefined) {
        parsed.waterGlasses = Math.min(8, Math.round(parsed.waterOunces / 10)) || 0;
        delete parsed.waterOunces;
      }
      return parsed;
    }
    return defaultDiet;
  });

  const [habitState, setHabitStateState] = useState<HabitTrackerDay>(() => {
    const raw = localStorage.getItem("commando_habits");
    return raw ? JSON.parse(raw) : defaultHabits;
  });

  const [chatMessages, setChatMessagesState] = useState<ChatMessage[]>(() => {
    const raw = localStorage.getItem("commando_chat");
    return raw ? JSON.parse(raw) : [
      { id: "welcome-1", sender: "coach", text: "Radical Terminal active. AI Diagnostic Coach online. Let's calibrate your cellular transformation.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
  });

  const [historicalProgress, setHistoricalProgressState] = useState<number[]>(() => {
    const raw = localStorage.getItem("commando_fitness_history");
    return raw ? JSON.parse(raw) : [100, 66, 33, 100, 66, 66];
  });

  const [historicalSteps, setHistoricalStepsState] = useState<number[]>(() => {
    const raw = localStorage.getItem("commando_steps_history");
    return raw ? JSON.parse(raw) : [13000, 12500, 14000, 9500, 12200, 13100];
  });

  const [historicalHabits, setHistoricalHabitsState] = useState<number[]>(() => {
    const raw = localStorage.getItem("commando_habits_history");
    return raw ? JSON.parse(raw) : [6, 5, 6, 4, 5, 6];
  });

  const [biometricLogs, setBiometricLogsState] = useState<BiometricLog[]>(() => {
    const raw = localStorage.getItem("commando_biometrics");
    return raw ? JSON.parse(raw) : defaultSeedBiometrics;
  });

  const [targetWeight, setTargetWeightState] = useState<number>(() => {
    const raw = localStorage.getItem("commando_target_weight");
    return raw ? parseFloat(raw) : 75;
  });

  const [userTier, setUserTierState] = useState<"Free" | "Tactical Private" | "Iron Sergeant" | "Apex Commander" | "Vanguard Marshal">((() => {
    return (localStorage.getItem("commando_user_tier") as any) || "Free";
  }));

  const [billingCycle, setBillingCycleState] = useState<"weekly" | "monthly" | "yearly">((() => {
    return (localStorage.getItem("commando_billing_cycle") as any) || "monthly";
  }));

  const [weeklyReports, setWeeklyReportsState] = useState<string[]>(() => {
    const raw = localStorage.getItem("commando_weekly_reports");
    return raw ? JSON.parse(raw) : [];
  });

  const [challengesMonthly, setChallengesMonthlyState] = useState<any[]>(() => {
    const raw = localStorage.getItem("commando_challenges_monthly");
    return raw ? JSON.parse(raw) : [
      { month: "Jan 2026", completedCount: 3 },
      { month: "Feb 2026", completedCount: 4 },
      { month: "Mar 2026", completedCount: 2 },
      { month: "Apr 2026", completedCount: 5 },
      { month: "May 2026", completedCount: 6 }
    ];
  });

  const [customChallengeDone, setCustomChallengeDoneState] = useState<boolean>(() => {
    const raw = localStorage.getItem("commando_custom_challenge_done");
    return raw === "true";
  });

  // UI Local states (no need for persistence, but kept in state for child coordination)
  const [activeTab, setActiveTab] = useState<"landing" | "onboarding" | "dashboard">("landing");
  const [dashboardPage, setDashboardPage] = useState<"overview" | "fitness" | "diet" | "habits" | "challenges" | "tracker" | "coach" | "analytics">("overview");
  const [inputMsg, setInputMsg] = useState("");
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [triggerCelebration, setTriggerCelebration] = useState(false);
  const [celebrationBadge, setCelebrationBadge] = useState("TACTICAL PRIVATE COMPLIANCE");

  // Streak checking and celebration triggers
  const stepsGoal = 12000;
  
  const countCompletedHabits = () => {
    let count = 0;
    if (habitState.quitSmoking) count++;
    if (habitState.quitAlcohol) count++;
    if (habitState.quitDrugs) count++;
    if (habitState.quitNegativeCompany) count++;
    if (habitState.sleepDiscipline) count++;
    if (habitState.hydrationChecked) count++;
    if (habitState.gymCompleted) count++;
    if (habitState.journalingCompleted) count++;
    if (habitState.readingCompleted) count++;
    if (habitState.stretchProtocol) count++;
    if (habitState.restDayObserved) count++;
    if (habitState.saunaTherapy) count++;
    if (habitState.coldShower) count++;
    if (habitState.smallPortions) count++;
    if (habitState.multipleMeals) count++;
    return count;
  };

  const stepsStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const stepsVal = i === 0 ? habitState.stepsCompleted : (historicalSteps[dateKey] ?? 0);
      if (stepsVal >= stepsGoal) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  const habitsStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const completedVal = i === 0 ? countCompletedHabits() : (historicalHabits[dateKey] ?? 0);
      if (completedVal >= 5) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  const prevStepsStreakRef = React.useRef<number | null>(null);
  const prevHabitsStreakRef = React.useRef<number | null>(null);

  useEffect(() => {
    prevStepsStreakRef.current = stepsStreak;
    prevHabitsStreakRef.current = habitsStreak;
  }, []);

  useEffect(() => {
    if (prevStepsStreakRef.current !== null && stepsStreak === 7 && prevStepsStreakRef.current < 7) {
      setCelebrationBadge("MITO-TITAN (7-Day Steps)");
      setTriggerCelebration(true);
    }
    prevStepsStreakRef.current = stepsStreak;
  }, [stepsStreak]);

  useEffect(() => {
    if (prevHabitsStreakRef.current !== null && habitsStreak === 7 && prevHabitsStreakRef.current < 7) {
      setCelebrationBadge("UNBREAKABLE WILL (7-Day Habits)");
      setTriggerCelebration(true);
    }
    prevHabitsStreakRef.current = habitsStreak;
  }, [habitsStreak]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("radical_auth_logged") === "true";
  });

  const [authEmail, setAuthEmail] = useState<string | null>(() => {
    return localStorage.getItem("radical_auth_email");
  });

  // Debounced LocalStorage sync
  useEffect(() => {
    const handler = setTimeout(() => {
      if (profile) localStorage.setItem("commando_profile", JSON.stringify(profile));
      if (plan) localStorage.setItem("commando_plan", JSON.stringify(plan));
      localStorage.setItem("commando_workouts", JSON.stringify(workoutLogs));
      localStorage.setItem("commando_diet", JSON.stringify(dietLog));
      localStorage.setItem("commando_habits", JSON.stringify(habitState));
      localStorage.setItem("commando_chat", JSON.stringify(chatMessages));
      localStorage.setItem("commando_fitness_history", JSON.stringify(historicalProgress));
      localStorage.setItem("commando_steps_history", JSON.stringify(historicalSteps));
      localStorage.setItem("commando_habits_history", JSON.stringify(historicalHabits));
      localStorage.setItem("commando_biometrics", JSON.stringify(biometricLogs));
      localStorage.setItem("commando_target_weight", targetWeight.toString());
      localStorage.setItem("commando_user_tier", userTier);
      localStorage.setItem("commando_billing_cycle", billingCycle);
      localStorage.setItem("commando_weekly_reports", JSON.stringify(weeklyReports));
      localStorage.setItem("commando_challenges_monthly", JSON.stringify(challengesMonthly));
      localStorage.setItem("commando_custom_challenge_done", customChallengeDone.toString());
      localStorage.setItem("radical_auth_logged", isAuthenticated.toString());
      if (authEmail) localStorage.setItem("radical_auth_email", authEmail);
    }, 300);

    return () => clearTimeout(handler);
  }, [profile, plan, workoutLogs, dietLog, habitState, chatMessages, historicalProgress, historicalSteps, historicalHabits, biometricLogs, targetWeight, userTier, billingCycle, weeklyReports, challengesMonthly, customChallengeDone, isAuthenticated, authEmail]);

  // Reset all application data
  const resetAllData = () => {
    localStorage.clear();
    setProfileState(null);
    setPlanState(null);
    setWorkoutLogsState(defaultWorkouts);
    setDietLogState(defaultDiet);
    setHabitStateState(defaultHabits);
    setChatMessagesState([
      { id: "welcome-1", sender: "coach", text: "Radical Terminal active. AI Diagnostic Coach online. Let's calibrate your cellular transformation.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setHistoricalProgressState([100, 66, 33, 100, 66, 66]);
    setHistoricalStepsState([13000, 12500, 14000, 9500, 12200, 13100]);
    setHistoricalHabitsState([6, 5, 6, 4, 5, 6]);
    setBiometricLogsState(defaultSeedBiometrics);
    setTargetWeightState(75);
    setUserTierState("Free");
    setBillingCycleState("monthly");
    setWeeklyReportsState([]);
    setChallengesMonthlyState([
      { month: "Jan 2026", completedCount: 3 },
      { month: "Feb 2026", completedCount: 4 },
      { month: "Mar 2026", completedCount: 2 },
      { month: "Apr 2026", completedCount: 5 },
      { month: "May 2026", completedCount: 6 }
    ]);
    setCustomChallengeDoneState(false);
    setActiveTab("landing");
    setDashboardPage("overview");
    setIsAuthenticated(false);
    setAuthEmail(null);
  };

  const signup = (email: string, pass: string): boolean => {
    if (!email || !pass) return false;
    const usersRaw = localStorage.getItem("radical_auth_users");
    const users = usersRaw ? JSON.parse(usersRaw) : {};
    if (users[email]) return false; // user exists
    users[email] = pass;
    localStorage.setItem("radical_auth_users", JSON.stringify(users));
    setIsAuthenticated(true);
    setAuthEmail(email);
    return true;
  };

  const login = (email: string, pass: string): boolean => {
    if (!email || !pass) return false;
    const usersRaw = localStorage.getItem("radical_auth_users");
    const users = usersRaw ? JSON.parse(usersRaw) : {};
    if (users[email] && users[email] === pass) {
      setIsAuthenticated(true);
      setAuthEmail(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthEmail(null);
    localStorage.removeItem("radical_auth_logged");
    localStorage.removeItem("radical_auth_email");
  };

  const state: CommandoState = {
    profile, plan, workoutLogs, dietLog, habitState, chatMessages,
    historicalProgress, historicalSteps, historicalHabits, biometricLogs,
    targetWeight, userTier, billingCycle, weeklyReports, challengesMonthly,
    customChallengeDone, activeTab, dashboardPage, inputMsg, isCoachTyping,
    isShareModalOpen, isPaywallOpen, triggerCelebration, celebrationBadge,
    isAuthenticated, authEmail
  };

  const setChatMessages = (msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    if (typeof msgs === "function") {
      setChatMessagesState(msgs);
    } else {
      setChatMessagesState(msgs);
    }
  };

  const setWeeklyReports = (reports: string[] | ((prev: string[]) => string[])) => {
    if (typeof reports === "function") {
      setWeeklyReportsState(reports);
    } else {
      setWeeklyReportsState(reports);
    }
  };

  return (
    <CommandoContext.Provider value={{
      state,
      setProfile: setProfileState,
      setPlan: setPlanState,
      setWorkoutLogs: setWorkoutLogsState,
      setDietLog: setDietLogState,
      setHabitState: setHabitStateState,
      setChatMessages,
      setHistoricalProgress: setHistoricalProgressState,
      setHistoricalSteps: setHistoricalStepsState,
      setHistoricalHabits: setHistoricalHabitsState,
      setBiometricLogs: setBiometricLogsState,
      setTargetWeight: setTargetWeightState,
      setUserTier: setUserTierState,
      setBillingCycle: setBillingCycleState,
      setWeeklyReports,
      setChallengesMonthly: setChallengesMonthlyState,
      setCustomChallengeDone: setCustomChallengeDoneState,
      setActiveTab,
      setDashboardPage,
      setInputMsg,
      setIsCoachTyping,
      setIsShareModalOpen,
      setIsPaywallOpen,
      setTriggerCelebration,
      setCelebrationBadge,
      resetAllData,
      signup,
      login,
      logout
    }}>
      {children}
    </CommandoContext.Provider>
  );
}

export function useCommando() {
  const context = useContext(CommandoContext);
  if (!context) {
    throw new Error("useCommando must be used within a CommandoProvider");
  }
  return context;
}
