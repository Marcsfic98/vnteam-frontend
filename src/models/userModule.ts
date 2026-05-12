import type WorkoutPlan from "./WorkoutPlanModule";

export default interface User {
  id: number;
  name: string;
  email: string;
  image: string; 
  workoutPlans: WorkoutPlan[]; 
  diet: any[];
}