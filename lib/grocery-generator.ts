import type { GroceryItem, GrocerySections, Ingredient, PantryItem, PlannedRecipe } from "@/types";
import { decideBuyingMode, isFreshEnough, isLowStock, suggestedActionFor } from "./freshness-engine";
import { weeklyEssentials as defaultWeeklyEssentials } from "./seed-recipes";

const keyFor = (ingredient: Ingredient) => ingredient.name.trim().toLowerCase();

function mergeIngredient(map: Map<string, GroceryItem>, ingredient: Ingredient, recipeName: string, day?: string) {
  const key = keyFor(ingredient);
  const buyingMode = decideBuyingMode(ingredient);
  const existing = map.get(key);
  if (existing && existing.unit === ingredient.unit) {
    existing.quantity += ingredient.quantity;
    existing.usedIn = Array.from(new Set([...existing.usedIn, recipeName]));
    if (day) existing.cookingDates = Array.from(new Set([...(existing.cookingDates ?? []), day]));
    return;
  }
  map.set(key, {
    ...ingredient,
    buyingMode,
    usedIn: [recipeName],
    status: ingredient.optional ? "optional" : "need",
    suggestedAction: "",
    cookingDates: day ? [day] : undefined
  });
}

export function generateGroceryList(plan: PlannedRecipe[], pantry: PantryItem[], essentials: Ingredient[] | false = defaultWeeklyEssentials): GrocerySections {
  const map = new Map<string, GroceryItem>();
  plan.forEach((planned) => {
    planned.recipe.ingredients.forEach((ingredient) => mergeIngredient(map, ingredient, planned.recipe.name, planned.day));
  });
  if (essentials) {
    essentials.forEach((ingredient) => mergeIngredient(map, ingredient, "Weekly essentials"));
  }

  const pantryByName = new Map(pantry.map((item) => [item.name.toLowerCase(), item]));
  const sections: GrocerySections = {
    todayFresh: [],
    sameDayByDate: {},
    weeklyFresh: [],
    monthlyStaples: [],
    quarterlyBulk: [],
    checkPantry: [],
    optional: [],
    ignored: []
  };

  for (const item of map.values()) {
    const pantryItem = pantryByName.get(item.name.toLowerCase());
    item.availableQuantity = pantryItem?.quantity;
    if (pantryItem && isFreshEnough(pantryItem, item)) item.status = "have";
    else if (pantryItem && isLowStock(pantryItem)) item.status = "low";
    else if (pantryItem && !isFreshEnough(pantryItem, item)) item.status = "stale";
    item.suggestedAction = suggestedActionFor(item);

    if (item.optional) sections.optional.push(item);
    else if (item.status === "have") sections.checkPantry.push(item);
    else if (item.buyingMode === "same_day_fresh") {
      for (const date of item.cookingDates ?? ["Today"]) {
        sections.sameDayByDate[date] = [...(sections.sameDayByDate[date] ?? []), item];
      }
      if ((item.cookingDates ?? []).includes("Monday")) sections.todayFresh.push(item);
    } else if (item.buyingMode === "daily_use" || item.buyingMode === "weekly_fresh") sections.weeklyFresh.push(item);
    else if (item.buyingMode === "monthly_staple" || item.buyingMode === "recipe_based") sections.monthlyStaples.push(item);
    else if (item.buyingMode === "quarterly_bulk") sections.quarterlyBulk.push(item);
    else sections.checkPantry.push(item);
  }

  return sections;
}
