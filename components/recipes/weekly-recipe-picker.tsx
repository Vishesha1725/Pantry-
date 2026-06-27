"use client";

import { useMemo, useState } from "react";
import { RecipeCard } from "./recipe-card";
import type { Recipe } from "@/types";

export function WeeklyRecipePicker({ recipes, initialSelected }: { recipes: Recipe[]; initialSelected: string[] }) {
  const [selected, setSelected] = useState(initialSelected);
  const weekly = useMemo(() => recipes.slice(0, 20), [recipes]);
  return (
    <div className="space-y-5">
      <div className="cozy-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div>
          <h2 className="text-xl font-black text-cocoa">Weekly recipe quest</h2>
          <p className="text-sm text-muted-foreground">Pick up to 7. This local demo starts with a healthy vegetarian set ready to generate groceries.</p>
        </div>
        <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-cocoa">{selected.length}/7 selected</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {weekly.map((recipe) => (
          <button key={recipe.id} className="text-left" onClick={() => setSelected((current) => current.includes(recipe.id) ? current.filter((id) => id !== recipe.id) : current.length < 7 ? [...current, recipe.id] : current)}>
            <RecipeCard recipe={recipe} selected={selected.includes(recipe.id)} />
          </button>
        ))}
      </div>
    </div>
  );
}
