"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { GroceryItem, GrocerySectionKey, GrocerySections, PantryItem, PlannedRecipe, Recipe } from "@/types";
import { generateGroceryList } from "./grocery-generator";
import { samplePantry, seedRecipes, selectedRecipeIds } from "./seed-recipes";

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type AppState = {
  pantryItems: PantryItem[];
  recipeLibrary: Recipe[];
  selectedRecipeIds: string[];
  weeklyPlan: PlannedRecipe[];
  grocerySections: GrocerySections;
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
  generateGroceries: () => void;
  updateGroceryItem: (section: GrocerySectionKey, itemName: string, updates: Partial<GroceryItem>) => void;
  deleteGroceryItem: (section: GrocerySectionKey, itemName: string) => void;
  clearGroceryList: () => void;
  addPantryItem: (item: PantryItem) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  deletePantryItem: (id: string) => void;
  loadDemoData: () => void;
  resetAppData: () => void;
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
  grocerySections: emptyGrocerySections()
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
    grocerySections: state.grocerySections ?? emptyGrocerySections()
  };
}

function updateList(items: GroceryItem[], itemName: string, updates: Partial<GroceryItem>) {
  return items.map((item) => item.name === itemName ? { ...item, ...updates } : item);
}

function removeFromList(items: GroceryItem[], itemName: string) {
  return items.filter((item) => item.name !== itemName);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

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
    selectRecipe: (id) => {
      let result: { ok: boolean; message?: string } = { ok: true };
      setState((current) => {
        if (current.selectedRecipeIds.includes(id)) return current;
        if (current.selectedRecipeIds.length >= 7) {
          result = { ok: false, message: "Your weekly basket is full. Remove one recipe before adding another." };
          return current;
        }
        return { ...current, selectedRecipeIds: [...current.selectedRecipeIds, id] };
      });
      return result;
    },
    unselectRecipe: (id) => setState((current) => ({
      ...current,
      selectedRecipeIds: current.selectedRecipeIds.filter((recipeId) => recipeId !== id),
      weeklyPlan: current.weeklyPlan.filter((item) => item.recipe.id !== id)
    })),
    createWeeklyPlan: () => setState((current) => {
      const recipes = current.selectedRecipeIds
        .map((id) => current.recipeLibrary.find((recipe) => recipe.id === id))
        .filter((recipe): recipe is Recipe => Boolean(recipe));
      return {
        ...current,
        weeklyPlan: recipes.map((recipe, index) => {
          const existing = current.weeklyPlan.find((item) => item.recipe.id === recipe.id);
          return existing ?? { day: days[index % days.length], slot: "dinner", recipe };
        })
      };
    }),
    movePlannedRecipe: (recipeId, day) => setState((current) => ({
      ...current,
      weeklyPlan: current.weeklyPlan.map((item) => item.recipe.id === recipeId ? { ...item, day } : item)
    })),
    removePlannedRecipe: (recipeId) => setState((current) => ({
      ...current,
      weeklyPlan: current.weeklyPlan.filter((item) => item.recipe.id !== recipeId),
      selectedRecipeIds: current.selectedRecipeIds.filter((id) => id !== recipeId)
    })),
    clearWeeklyPlan: () => setState((current) => ({ ...current, weeklyPlan: [], selectedRecipeIds: [], grocerySections: emptyGrocerySections() })),
    addRecipesToPlan: (recipes) => setState((current) => {
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
      return { ...current, recipeLibrary: nextLibrary, selectedRecipeIds: nextSelected, weeklyPlan: nextPlan };
    }),
    generateGroceries: () => setState((current) => ({ ...current, grocerySections: generateGroceryList(current.weeklyPlan, current.pantryItems) })),
    updateGroceryItem: (section, itemName, updates) => setState((current) => {
      const next = structuredClone(current.grocerySections);
      if (section.startsWith("sameDayByDate:")) {
        const date = section.replace("sameDayByDate:", "");
        next.sameDayByDate[date] = updateList(next.sameDayByDate[date] ?? [], itemName, updates);
      } else {
        const flatSection = section as FlatGrocerySectionKey;
        next[flatSection] = updateList(next[flatSection], itemName, updates);
      }
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
      return { ...current, grocerySections: next };
    }),
    clearGroceryList: () => setState((current) => ({ ...current, grocerySections: emptyGrocerySections() })),
    addPantryItem: (item) => setState((current) => ({ ...current, pantryItems: [{ ...item, id: item.id || crypto.randomUUID() }, ...current.pantryItems] })),
    updatePantryItem: (id, updates) => setState((current) => ({ ...current, pantryItems: current.pantryItems.map((item) => item.id === id ? { ...item, ...updates } : item) })),
    deletePantryItem: (id) => setState((current) => ({ ...current, pantryItems: current.pantryItems.filter((item) => item.id !== id) })),
    loadDemoData: () => {
      const plan = demoPlan();
      setState({
        pantryItems: samplePantry,
        recipeLibrary: seedRecipes,
        selectedRecipeIds,
        weeklyPlan: plan,
        grocerySections: generateGroceryList(plan, samplePantry)
      });
    },
    resetAppData: () => setState(initialState)
  }), [hydrated, selectedRecipes, state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function usePantryQuest() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("usePantryQuest must be used inside AppStateProvider");
  return context;
}
