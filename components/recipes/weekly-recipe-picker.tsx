"use client";

import { useMemo, useState } from "react";
import { RecipeCard } from "./recipe-card";
import type { Recipe } from "@/types";
import { usePantryQuest } from "@/lib/app-state";
import { SelectedRecipeBasket } from "./selected-recipe-basket";

export function WeeklyRecipePicker({ recipes }: { recipes: Recipe[] }) {
  const { selectedRecipeIds, selectRecipe, unselectRecipe, createWeeklyPlan, addRecipesToPlan } = usePantryQuest();
  const [message, setMessage] = useState("");
  const weekly = useMemo(() => recipes.slice(0, 20), [recipes]);
  return (
    <div className="space-y-5">
      <div className="cozy-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div>
          <h2 className="text-xl font-black text-cocoa">Weekly recipe quest</h2>
          <p className="text-sm text-muted-foreground">Pick up to 7 vegetarian recipes. Seed ideas are available, but your plan starts clean.</p>
        </div>
        <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-cocoa">{selectedRecipeIds.length}/7 selected</span>
      </div>
      {message && <div className="rounded-2xl border border-coral/30 bg-coral/10 p-3 text-sm font-bold text-cocoa">{message}</div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {weekly.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            selected={selectedRecipeIds.includes(recipe.id)}
            onSelect={() => {
              if (selectedRecipeIds.includes(recipe.id)) {
                unselectRecipe(recipe.id);
                setMessage("");
              } else {
                const result = selectRecipe(recipe.id);
                setMessage(result.message ?? "");
              }
            }}
            onAddToPlan={() => {
              addRecipesToPlan([recipe]);
              setMessage(`${recipe.name} is ready for the weekly plan.`);
            }}
          />
        ))}
      </div>
      <SelectedRecipeBasket />
    </div>
  );
}
