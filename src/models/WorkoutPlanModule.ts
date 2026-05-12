import type User from "./userModule";
import type { WorkoutDay } from "./workoutDaysModule";

export interface WorkoutPlan {
  id: number;
  name: string;
  isActive: boolean;
  workoutDays?: WorkoutDay[]; 
  user?: User; 
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutPlanDto {
  name: string;
  isActive: boolean;
  userId?: number; 
}