"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, ShoppingBasket, Sparkles } from "lucide-react";
import { parseRecipesFromText } from "@/lib/recipe-parser";
import { usePantryQuest } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { IngredientReviewTable } from "@/components/grocery/ingredient-review-table";
import type { Ingredient, PlannedRecipe } from "@/types";

const sample = "";

export function RecipePasteBox() {
  const [text, setText] = useState(sample);
  const [parsed, setParsed] = useState<PlannedRecipe[]>([]);
  const { addRecipesToPlan, addRecipesToPlanAndGenerate } = usePantryQuest();
  const router = useRouter();
  const preview = useMemo(() => text.trim() ? parseRecipesFromText(text) : [], [text]);

  const updateIngredient = (recipeId: string, name: string, updates: Partial<Ingredient>) => {
    setParsed((current) => current.map((planned) => planned.recipe.id === recipeId
      ? { ...planned, recipe: { ...planned.recipe, ingredients: planned.recipe.ingredients.map((ingredient) => ingredient.name === name ? { ...ingredient, ...updates } : ingredient) } }
      : planned));
  };
  const deleteIngredient = (recipeId: string, name: string) => {
    setParsed((current) => current.map((planned) => planned.recipe.id === recipeId
      ? { ...planned, recipe: { ...planned.recipe, ingredients: planned.recipe.ingredients.filter((ingredient) => ingredient.name !== name) } }
      : planned));
  };
  const saveToPlan = () => {
    addRecipesToPlan(parsed.map((item) => item.recipe));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="cozy-panel rounded-2xl p-5">
        <textarea
          className="min-h-[420px] w-full resize-none rounded-2xl border bg-white/75 p-4 text-sm outline-none focus:ring-2 focus:ring-sage"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste a recipe, meal idea, or 7-day plan here..."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setParsed(preview)} disabled={!preview.length}><Sparkles className="h-4 w-4" />Extract Recipes</Button>
          <Button variant="secondary" onClick={() => setParsed(preview)} disabled={!preview.length}>Extract Ingredients</Button>
          <Button variant="outline" onClick={saveToPlan} disabled={!parsed.length}><ListPlus className="h-4 w-4" />Add to Weekly Plan</Button>
          <Button
            variant="coral"
            onClick={() => {
              addRecipesToPlanAndGenerate(parsed.map((item) => item.recipe));
              router.push("/grocery");
            }}
            disabled={!parsed.length}
          >
            <ShoppingBasket className="h-4 w-4" />Generate Grocery List
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {(parsed.length ? parsed : preview).map((item) => (
          <IngredientReviewTable
            key={item.recipe.id}
            planned={item}
            onUpdateIngredient={(name, updates) => updateIngredient(item.recipe.id, name, updates)}
            onDeleteIngredient={(name) => deleteIngredient(item.recipe.id, name)}
          />
        ))}
      </div>
    </div>
  );
}
