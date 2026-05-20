import type Meal from "./MealModule";

export default interface Diet {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  meals: Meal[];
}