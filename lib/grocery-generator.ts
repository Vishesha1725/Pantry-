import type { BuyingMode, CombinedGroceryItem, GroceryItem, GrocerySections, GroceryStatus, Ingredient, PantryItem, PlannedRecipe, RecipeWiseGroceryGroup, RecipeWiseGroceryItem } from "@/types";
import { decideBuyingMode, isFreshEnough, isLowStock, suggestedActionFor } from "./freshness-engine";
import { weeklyEssentials as defaultWeeklyEssentials } from "./seed-recipes";

const keyFor = (ingredient: Ingredient) => ingredient.name.trim().toLowerCase();

function defaultStatusFor(mode: BuyingMode): GroceryStatus {
  if (mode === "same_day_fresh") return "order_fresh_on_day";
  if (mode === "monthly_staple" || mode === "pantry_check") return "check_pantry";
  if (mode === "one_time") return "have_at_home";
  return "need_to_order";
}

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

export function generateStructuredGroceryList(plan: PlannedRecipe[], essentials: Ingredient[] | false = defaultWeeklyEssentials) {
  const recipeWiseGroceryList: RecipeWiseGroceryGroup[] = plan.map((planned) => ({
    recipeId: planned.recipe.id,
    recipeName: planned.recipe.name,
    mealDay: planned.day,
    ingredients: planned.recipe.ingredients.map((ingredient): RecipeWiseGroceryItem => {
      const buyingMode = decideBuyingMode(ingredient);
      return {
        ...ingredient,
        buyingMode,
        usedInRecipeId: planned.recipe.id,
        usedInRecipeName: planned.recipe.name,
        mealDay: planned.day,
        status: ingredient.defaultStatus ?? defaultStatusFor(buyingMode),
        notes: ingredient.notes ?? ingredient.freshnessRule
      };
    })
  }));

  if (essentials) {
    recipeWiseGroceryList.push({
      recipeId: "weekly-essentials",
      recipeName: "Weekly Essentials",
      mealDay: "Weekly",
      ingredients: essentials.map((ingredient): RecipeWiseGroceryItem => {
        const buyingMode = decideBuyingMode(ingredient);
        return {
          ...ingredient,
          buyingMode,
          usedInRecipeId: "weekly-essentials",
          usedInRecipeName: "Weekly Essentials",
          mealDay: "Weekly",
          status: ingredient.defaultStatus ?? defaultStatusFor(buyingMode),
          notes: ingredient.notes ?? ingredient.freshnessRule
        };
      })
    });
  }

  const combinedMap = new Map<string, CombinedGroceryItem>();
  recipeWiseGroceryList.flatMap((group) => group.ingredients).forEach((item) => {
    const keepSeparate = item.buyingMode === "same_day_fresh";
    const key = keepSeparate ? `${item.name.toLowerCase()}-${item.mealDay}-${item.usedInRecipeId}` : `${item.name.toLowerCase()}-${item.unit}`;
    const existing = combinedMap.get(key);
    if (existing && existing.unit === item.unit) {
      existing.totalQuantity += item.quantity;
      existing.usedInRecipes = Array.from(new Set([...existing.usedInRecipes, item.usedInRecipeName]));
      return;
    }
    combinedMap.set(key, {
      id: key.replace(/[^a-z0-9]+/gi, "-"),
      ingredientName: keepSeparate ? `${item.mealDay} ${item.name}` : item.name,
      totalQuantity: item.quantity,
      unit: item.unit,
      category: item.category,
      buyingMode: item.buyingMode,
      usedInRecipes: [item.usedInRecipeName],
      status: item.status,
      mealDay: keepSeparate ? item.mealDay : undefined,
      notes: item.notes
    });
  });

  return { recipeWiseGroceryList, combinedGroceryList: Array.from(combinedMap.values()) };
}
