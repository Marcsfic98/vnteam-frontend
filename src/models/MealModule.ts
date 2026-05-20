import type MealItem from "./mealItemModule";

export default interface Meal {
  id: number;
  order: number;
  name: string;
  items?: MealItem[];
}