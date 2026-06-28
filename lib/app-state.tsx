"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { GroceryItem, GrocerySectionKey, GrocerySections, Ingredient, PantryItem, PlannedRecipe, Recipe } from "@/types";
import { generateGroceryList } from "./grocery-generator";
import { samplePantry, seedRecipes, selectedRecipeIds, weeklyEssentials as defaultWeeklyEssentials } from "./seed-recipes";

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type AppState = {
  pantryItems: PantryItem[];
  recipeLibrary: Recipe[];
  selectedRecipeIds: string[];
  weeklyPlan: PlannedRecipe[];
  grocerySections: GrocerySections;
  weeklyEssentials: Ingredient[];
};

type Toast = {
  id: string;
  message: string;
};

type AppContextValue = AppState & {
  hydrated: boolean;
  selectedRecipes: Recipe[];
  selectRecipe: (id: string) => { ok: boolean; message?: string };
  unselectRecipe: (id: string) => void;
  createWeeklyPlan: () => void;
  movePlannedRecipe: (recipeId: string, day: string) => void;
  removePlannedRecipe: (recipeId: string) => void;
  clearWeeklyPlan: () => void;
  addRecipesToPlan: (recipes: Recipe[]) => void;
  addRecipesToPlanAndGenerate: (recipes: Recipe[]) => void;
  generateGroceries: () => void;
  updateGroceryItem: (section: GrocerySectionKey, itemName: string, updates: Partial<GroceryItem>) => void;
  deleteGroceryItem: (section: GrocerySectionKey, itemName: string) => void;
  clearGroceryList: () => void;
  updateWeeklyEssential: (name: string, updates: Partial<Ingredient>) => void;
  deleteWeeklyEssential: (name: string) => void;
  addPantryItem: (item: PantryItem) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  deletePantryItem: (id: string) => void;
  loadDemoData: () => void;
  resetAppData: () => void;
  notify: (message: string) => void;
};

const emptyGrocerySections = (): GrocerySections => ({
  todayFresh: [],
  sameDayByDate: {},
  weeklyFresh: [],
  monthlyStaples: [],
  quarterlyBulk: [],
  checkPantry: [],
  optional: [],
  ignored: []
});

type FlatGrocerySectionKey = Exclude<keyof GrocerySections, "sameDayByDate">;

const initialState: AppState = {
  pantryItems: [],
  recipeLibrary: seedRecipes,
  selectedRecipeIds: [],
  weeklyPlan: [],
  grocerySections: emptyGrocerySections(),
  weeklyEssentials: defaultWeeklyEssentials
};

const storageKey = "pantry-quest-state-v2";
const AppStateContext = createContext<AppContextValue | null>(null);

function demoPlan(): PlannedRecipe[] {
  return selectedRecipeIds.map((id, index) => ({
    day: days[index],
    slot: "dinner",
    recipe: seedRecipes.find((recipe) => recipe.id === id) ?? seedRecipes[index]
  }));
}

function normalizeState(state: Partial<AppState>): AppState {
  return {
    pantryItems: state.pantryItems ?? [],
    recipeLibrary: seedRecipes,
    selectedRecipeIds: state.selectedRecipeIds ?? [],
    weeklyPlan: state.weeklyPlan ?? [],
    grocerySections: state.grocerySections ?? emptyGrocerySections(),
    weeklyEssentials: state.weeklyEssentials ?? defaultWeeklyEssentials
  };
}

function updateList(items: GroceryItem[], itemName: string, updates: Partial<GroceryItem>) {
  return items.map((item) => item.name === itemName ? { ...item, ...updates } : item);
}

function removeFromList(items: GroceryItem[], itemName: string) {
  return items.filter((item) => item.name !== itemName);
}

function allGroceryLists(sections: GrocerySections) {
  return [
    sections.todayFresh,
    ...Object.values(sections.sameDayByDate),
    sections.weeklyFresh,
    sections.monthlyStaples,
    sections.quarterlyBulk,
    sections.checkPantry,
    sections.optional,
    sections.ignored
  ];
}

function removeItemEverywhere(sections: GrocerySections, itemName: string) {
  sections.todayFresh = removeFromList(sections.todayFresh, itemName);
  Object.keys(sections.sameDayByDate).forEach((date) => {
    sections.sameDayByDate[date] = removeFromList(sections.sameDayByDate[date], itemName);
  });
  sections.weeklyFresh = removeFromList(sections.weeklyFresh, itemName);
  sections.monthlyStaples = removeFromList(sections.monthlyStaples, itemName);
  sections.quarterlyBulk = removeFromList(sections.quarterlyBulk, itemName);
  sections.checkPantry = removeFromList(sections.checkPantry, itemName);
  sections.optional = removeFromList(sections.optional, itemName);
  sections.ignored = removeFromList(sections.ignored, itemName);
}

function placeGroceryItem(sections: GrocerySections, item: GroceryItem) {
  if (item.status === "ignored") sections.ignored.push(item);
  else if (item.status === "have") sections.checkPantry.push(item);
  else if (item.optional) sections.optional.push(item);
  else if (item.buyingMode === "same_day_fresh") {
    const date = item.cookingDates?.[0] ?? "Cooking Day";
    sections.sameDayByDate[date] = [...(sections.sameDayByDate[date] ?? []), item];
  } else if (item.buyingMode === "weekly_fresh" || item.buyingMode === "daily_use") sections.weeklyFresh.push(item);
  else if (item.buyingMode === "monthly_staple" || item.buyingMode === "recipe_based") sections.monthlyStaples.push(item);
  else if (item.buyingMode === "quarterly_bulk") sections.quarterlyBulk.push(item);
  else sections.checkPantry.push(item);
}

function buildPlanWithRecipes(current: AppState, recipes: Recipe[]) {
  const incomingIds = recipes.map((recipe) => recipe.id);
  const nextSelected = Array.from(new Set([...current.selectedRecipeIds, ...incomingIds])).slice(0, 7);
  const nextLibrary = [...current.recipeLibrary];
  recipes.forEach((recipe) => {
    if (!nextLibrary.some((item) => item.id === recipe.id)) nextLibrary.push(recipe);
  });
  const selectedRecipesForPlan = nextSelected
    .map((id) => nextLibrary.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe));
  const nextPlan = selectedRecipesForPlan.map((recipe, index) => {
    const existing = current.weeklyPlan.find((item) => item.recipe.id === recipe.id);
    return existing ?? { day: days[index % days.length], slot: "dinner" as const, recipe };
  });
  return { nextLibrary, nextSelected, nextPlan };
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message }].slice(-3));
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 2600);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setState(normalizeState(JSON.parse(stored) as Partial<AppState>));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const selectedRecipes = useMemo(
    () => state.selectedRecipeIds.map((id) => state.recipeLibrary.find((recipe) => recipe.id === id)).filter((recipe): recipe is Recipe => Boolean(recipe)),
    [state.recipeLibrary, state.selectedRecipeIds]
  );

  const value = useMemo<AppContextValue>(() => ({
    ...state,
    hydrated,
    selectedRecipes,
    notify,
    selectRecipe: (id) => {
      let result: { ok: boolean; message?: string } = { ok: true };
      setState((current) => {
        if (current.selectedRecipeIds.includes(id)) return current;
        if (current.selectedRecipeIds.length >= 7) {
          result = { ok: false, message: "Your weekly basket is full. Remove one recipe before adding another." };
          notify(result.message ?? "Your weekly basket is full.");
          return current;
        }
        const recipeName = current.recipeLibrary.find((recipe) => recipe.id === id)?.name ?? "Recipe";
        notify(`${recipeName} selected`);
        return { ...current, selectedRecipeIds: [...current.selectedRecipeIds, id] };
      });
      return result;
    },
    unselectRecipe: (id) => setState((current) => {
      const recipeName = current.recipeLibrary.find((recipe) => recipe.id === id)?.name ?? "Recipe";
      notify(`${recipeName} removed`);
      return {
        ...current,
        selectedRecipeIds: current.selectedRecipeIds.filter((recipeId) => recipeId !== id),
        weeklyPlan: current.weeklyPlan.filter((item) => item.recipe.id !== id)
      };
    }),
    createWeeklyPlan: () => setState((current) => {
      const recipes = current.selectedRecipeIds
        .map((id) => current.recipeLibrary.find((recipe) => recipe.id === id))
        .filter((recipe): recipe is Recipe => Boolean(recipe));
      notify("Weekly plan created");
      return {
        ...current,
        weeklyPlan: recipes.map((recipe, index) => {
          const existing = current.weeklyPlan.find((item) => item.recipe.id === recipe.id);
          return existing ?? { day: days[index % days.length], slot: "dinner", recipe };
        })
      };
    }),
    movePlannedRecipe: (recipeId, day) => setState((current) => {
      notify(`Recipe moved to ${day}`);
      return {
        ...current,
        weeklyPlan: current.weeklyPlan.map((item) => item.recipe.id === recipeId ? { ...item, day } : item)
      };
    }),
    removePlannedRecipe: (recipeId) => setState((current) => {
      notify("Recipe removed from weekly plan");
      return {
        ...current,
        weeklyPlan: current.weeklyPlan.filter((item) => item.recipe.id !== recipeId),
        selectedRecipeIds: current.selectedRecipeIds.filter((id) => id !== recipeId)
      };
    }),
    clearWeeklyPlan: () => setState((current) => {
      notify("Weekly plan cleared");
      return { ...current, weeklyPlan: [], selectedRecipeIds: [], grocerySections: emptyGrocerySections() };
    }),
    addRecipesToPlan: (recipes) => setState((current) => {
      const { nextLibrary, nextSelected, nextPlan } = buildPlanWithRecipes(current, recipes);
      notify("Recipe added to weekly plan");
      return { ...current, recipeLibrary: nextLibrary, selectedRecipeIds: nextSelected, weeklyPlan: nextPlan };
    }),
    addRecipesToPlanAndGenerate: (recipes) => setState((current) => {
      const { nextLibrary, nextSelected, nextPlan } = buildPlanWithRecipes(current, recipes);
      notify("Recipe added and grocery list generated");
      return {
        ...current,
        recipeLibrary: nextLibrary,
        selectedRecipeIds: nextSelected,
        weeklyPlan: nextPlan,
        grocerySections: generateGroceryList(nextPlan, current.pantryItems, current.weeklyEssentials)
      };
    }),
    generateGroceries: () => setState((current) => {
      notify("Grocery list generated");
      return { ...current, grocerySections: generateGroceryList(current.weeklyPlan, current.pantryItems, current.weeklyEssentials) };
    }),
    updateGroceryItem: (section, itemName, updates) => setState((current) => {
      const next = structuredClone(current.grocerySections);
      const existing = allGroceryLists(next).flat().find((item) => item.name === itemName);
      if (section.startsWith("sameDayByDate:")) {
        const date = section.replace("sameDayByDate:", "");
        next.sameDayByDate[date] = updateList(next.sameDayByDate[date] ?? [], itemName, updates);
      } else {
        const flatSection = section as FlatGrocerySectionKey;
        next[flatSection] = updateList(next[flatSection], itemName, updates);
      }
      if (existing && (updates.buyingMode || updates.status === "ignored" || updates.status === "have")) {
        const updated = { ...existing, ...updates };
        removeItemEverywhere(next, itemName);
        placeGroceryItem(next, updated);
      }
      notify(updates.suggestedAction ?? `${itemName} updated`);
      return { ...current, grocerySections: next };
    }),
    deleteGroceryItem: (section, itemName) => setState((current) => {
      const next = structuredClone(current.grocerySections);
      if (section.startsWith("sameDayByDate:")) {
        const date = section.replace("sameDayByDate:", "");
        next.sameDayByDate[date] = removeFromList(next.sameDayByDate[date] ?? [], itemName);
      } else {
        const flatSection = section as FlatGrocerySectionKey;
        next[flatSection] = removeFromList(next[flatSection], itemName);
      }
      notify(`${itemName} removed`);
      return { ...current, grocerySections: next };
    }),
    clearGroceryList: () => setState((current) => {
      notify("Grocery list cleared");
      return { ...current, grocerySections: emptyGrocerySections() };
    }),
    updateWeeklyEssential: (name, updates) => setState((current) => {
      notify("Weekly essential updated");
      return { ...current, weeklyEssentials: current.weeklyEssentials.map((item) => item.name === name ? { ...item, ...updates } : item) };
    }),
    deleteWeeklyEssential: (name) => setState((current) => {
      notify("Weekly essential removed");
      return { ...current, weeklyEssentials: current.weeklyEssentials.filter((item) => item.name !== name) };
    }),
    addPantryItem: (item) => setState((current) => {
      notify("Pantry item added");
      return { ...current, pantryItems: [{ ...item, id: item.id || crypto.randomUUID() }, ...current.pantryItems] };
    }),
    updatePantryItem: (id, updates) => setState((current) => {
      notify("Pantry item updated");
      return { ...current, pantryItems: current.pantryItems.map((item) => item.id === id ? { ...item, ...updates } : item) };
    }),
    deletePantryItem: (id) => setState((current) => {
      notify("Pantry item deleted");
      return { ...current, pantryItems: current.pantryItems.filter((item) => item.id !== id) };
    }),
    loadDemoData: () => {
      const plan = demoPlan();
      setState({
        pantryItems: samplePantry,
        recipeLibrary: seedRecipes,
        selectedRecipeIds,
        weeklyPlan: plan,
        grocerySections: generateGroceryList(plan, samplePantry, defaultWeeklyEssentials),
        weeklyEssentials: defaultWeeklyEssentials
      });
      notify("Demo data loaded");
    },
    resetAppData: () => {
      setState(initialState);
      notify("App data reset");
    }
  }), [hydrated, notify, selectedRecipes, state]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[80] grid max-w-sm gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-2xl border bg-cocoa px-4 py-3 text-sm font-bold text-cream shadow-cozy">
            {toast.message}
          </div>
        ))}
      </div>
    </AppStateContext.Provider>
  );
}

export function usePantryQuest() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("usePantryQuest must be used inside AppStateProvider");
  return context;
}
