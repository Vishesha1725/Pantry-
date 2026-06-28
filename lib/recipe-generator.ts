import type { Recipe } from "@/types";
import { seedRecipes } from "./seed-recipes";

function weekSeed(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.floor((date.getTime() - start.getTime()) / 604_800_000);
}

export function generateLocalRecipes(count = 18, offset = 0): Recipe[] {
  const seed = weekSeed() + offset;
  const rotated = seedRecipes.map((recipe, index) => ({ recipe, score: (index * 17 + seed * 11) % seedRecipes.length }));
  return rotated
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(({ recipe }) => ({
      ...recipe,
      proteinSource: recipe.mainProtein,
      shortDescription: `${recipe.cuisine} ${recipe.mealType} built around ${recipe.mainProtein}, portioned for one cozy meal.`,
      freshnessNotes: recipe.ingredients.some((ingredient) => ingredient.buyingMode === "same_day_fresh")
        ? "Contains same-day fresh ingredients. Order close to cooking."
        : "Mostly pantry and weekly-fresh ingredients."
    }));
}
