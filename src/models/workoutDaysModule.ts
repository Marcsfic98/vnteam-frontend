import type { WorkoutExercice } from "./workoutExercice";
import type { WorkoutPlan } from "./WorkoutPlanModule";

export const WeekDay = {
  SEGUNDA: 'Segunda',
  TERCA: 'Terça',
  QUARTA: 'Quarta',
  QUINTA: 'Quinta',
  SEXTA: 'Sexta',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
} as const;

// Isso cria um tipo baseado nos valores acima
export type WeekDayType = typeof WeekDay[keyof typeof WeekDay];


export interface WorkoutDay {
  id?: number;
  name: string;
  isRest: boolean;
  weekDay: WeekDayType;
  estimatedDuration: number;
  workoutPlanId?: number;
  workoutPlan?: WorkoutPlan; 
  WorkoutExercice?: WorkoutExercice[]; 
  userWorkoutSessions?: any[];
}

export interface CreateWorkoutDayDto {
  name: string;
  isRest: boolean;
  weekDay: WeekDayType;
  estimatedDuration: number;
  workoutPlanId: number;
}