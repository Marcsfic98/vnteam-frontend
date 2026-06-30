import type Diet from "./dietModule";
import type { WorkoutPlan } from "./WorkoutPlanModule";


export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;


export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export default interface User {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
  image: string; 
  workoutPlans: WorkoutPlan[]; 
  diet: Diet[];
}