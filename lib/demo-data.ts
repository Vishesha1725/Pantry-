import { generateGroceryList } from "./grocery-generator";
import { samplePantry, seedRecipes, selectedRecipeIds } from "./seed-recipes";
import type { PlannedRecipe } from "@/types";

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const weeklyPlan: PlannedRecipe[] = selectedRecipeIds.map((id, index) => ({
  day: days[index],
  slot: "dinner",
  recipe: seedRecipes.find((recipe) => recipe.id === id) ?? seedRecipes[index]
}));

export const grocerySections = generateGroceryList(weeklyPlan, samplePantry);
