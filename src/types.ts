export interface UserProfile {
  name?: string;
  age: number;
  weight: number;
  height: number;
  trainingLevel: "Beginner" | "Intermediate" | "Advanced";
  dietPreference: "Carnivore" | "Keto" | "Low-carb" | "Diet cycling";
  focusGoal: string;
  waist?: number;
  hip?: number;
  caloriesTarget?: number;
  proteinTarget?: number;
  fatsTarget?: number;
  carbsTarget?: number;
  sleepHoursTarget?: number;
  hydrationTarget?: number;
  stepsTarget?: number;
  customChallenge?: string;
  tier?: "free" | "spec-ops" | "general";
  operationalLoad?: string;
  vulnerabilities?: string[];
  availableHardware?: string;
  chronoAllocation?: string;
  fuelingProtocol?: string;
  addictions?: string[];
  sleepHabits?: string;
  dailyStepCount?: number;
  portionSizeMealFrequency?: string;
  specialDiets?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: "Zone 2" | "Strength" | "Conditioning";
  name: string;
  completed: boolean;
}

export interface DietLog {
  date: string;
  breakfastChecked: boolean;
  lunchChecked: boolean;
  dinnerChecked: boolean;
  waterGlasses: number; // tracked via glasses (1-8)
}

export interface HabitTrackerDay {
  date: string;
  quitSmoking: boolean;
  quitAlcohol: boolean;
  quitDrugs: boolean;
  quitNegativeCompany: boolean;
  sleepDiscipline: boolean;
  hydrationChecked: boolean;
  gymCompleted: boolean;
  journalingCompleted: boolean;
  readingCompleted: boolean;
  stretchProtocol: boolean;
  restDayObserved: boolean;
  saunaTherapy: boolean;
  coldShower: boolean;
  smallPortions: boolean;
  multipleMeals: boolean;
  stepsCompleted: number; // e.g., 10000
}

export interface CommandoPlan {
  fitnessPlan: {
    zone2Desc: string;
    zone2Workouts: string[];
    strengthDesc: string;
    strengthWorkouts: string[];
    conditioningDesc: string;
    conditioningWorkouts: string[];
  };
  dietPlan: {
    regimenName: string;
    philosophy: string;
    meals: string[];
    tips: string[];
  };
  habitsPlan: {
    focusAreas: string[];
    actionSteps: string[];
    tips: string[];
  };
  motivationQuote: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export interface BiometricLog {
  id: string;
  date: string;
  weight: number;
  hip: number;
  waist: number;
}
