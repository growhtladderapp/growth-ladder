
export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  WORKOUT = 'WORKOUT',
  SCANNER = 'SCANNER',
  GUIDE = 'GUIDE',
  LOG = 'LOG',
  CHAT = 'CHAT',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  SETTINGS = 'SETTINGS',
  SUPPORT = 'SUPPORT',
  COMMUNITY = 'COMMUNITY'
}

export enum MuscleGroup {
  CHEST = 'Pecho',
  BACK = 'Espalda',
  LEGS = 'Piernas',
  SHOULDERS = 'Hombros',
  ARMS = 'Brazos',
  ABS = 'Abdominales',
  FULL_BODY = 'Cuerpo Completo',
  UPPER = 'Tren Superior',
  LOWER = 'Tren Inferior'
}

export enum Sport {
  SOCCER = 'Fútbol',
  BASKETBALL = 'Baloncesto',
  TENNIS = 'Tenis',
  RUNNING = 'Running',
  CROSSFIT = 'CrossFit',
  SWIMMING = 'Natación'
}

export interface DailyLogEntry {
  date: string;
  calories: number;
  distanceKm: number;
  mood: number; // 1-5
  weight: number;
  // Pro Fields
  bodyFat?: number;
  muscleMass?: number;
  waterPercent?: number;
  // Nutrition Macros
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO string for the day
  time: string; // HH:mm
  title: string;
  completed: boolean;
  notified?: boolean;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
}

export interface Routine {
  title: string;
  description: string;
  exercises: Exercise[];
  estimatedDuration: string;
}

export interface ExerciseGuide {
  name: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  instructions: string[];
  commonError: string;
  gifUrl?: string;
}

export interface MuscleGuide {
  muscle: string;
  introduction: string;
  exercises: ExerciseGuide[];
}

export interface SportGuide {
  sport: string;
  focus: string;
  introduction: string;
  exercises: ExerciseGuide[];
}

export interface UserBiometrics {
  age: number;
  weight: number;
  height: number;
}

export interface UserGoal {
  experience: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  focus: 'Muscle Gain' | 'Weight Loss' | 'Endurance';
  daysAvailable: number;
}

export interface UserProfile extends UserBiometrics, UserGoal {
  name?: string;
  profilePicture?: string; // New field for custom logo/avatar
  gender?: 'Masculino' | 'Femenino' | 'Otro';
  level?: number;
  xp?: number;
  goalsCompleted?: number;
  createdAt?: string; // ISO Date
}

export interface FoodAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: string;
}

export type GoalType = 'COUNT' | 'CALORIES' | 'DISTANCE';
export type DurationType = 'WEEK' | 'MONTH' | 'YEAR';

export interface WeeklyGoalOption {
  id: number;
  title: string;
  description: string;
  target: number;
  type: GoalType;
  unit: string;
  // Note: icon is React.ElementType which might need import or be 'any' to avoid strict dep
  // storing just a string key might be safer for pure types, but let's keep it simple for now
  // We won't strictly type 'icon' here to avoid React dependency in types.ts if possible, 
  // We won't strictly type 'icon' here to avoid React dependency in types.ts if possible, 
  // but if needed we can import React.
  icon: any;
  gradient: string;
  shadow: string;
  isPro?: boolean;
}
