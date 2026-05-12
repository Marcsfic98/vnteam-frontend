import type { WorkoutDay } from "./workoutDaysModule";

export interface WorkoutExercice {
  id: number;
  order: number;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  workoutDayId: number;
  workoutDay?: WorkoutDay; 

}

export interface CreateWorkoutExerciceDto {
  order: number;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  workoutDayId: number;
}