"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { parseRecipesFromText } from "@/lib/recipe-parser";
import { Button } from "@/components/ui/button";
import { IngredientReviewTable } from "@/components/grocery/ingredient-review-table";

const sample = `Monday: Paneer wrap dinner
- 200g paneer
- 4 wraps
- onions, tomatoes, curd

Friday: Rajma quinoa salad
- 1 cup rajma
- cucumber
- lemon`;

export function RecipePasteBox() {
  const [text, setText] = useState(sample);
  const parsed = useMemo(() => parseRecipesFromText(text), [text]);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="cozy-panel rounded-2xl p-5">
        <textarea
          className="min-h-[420px] w-full resize-none rounded-2xl border bg-white/75 p-4 text-sm outline-none focus:ring-2 focus:ring-sage"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste your recipe or 7-day meal plan here..."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button><Sparkles className="h-4 w-4" />Extract Recipes</Button>
          <Button variant="secondary">Extract Ingredients</Button>
          <Button variant="outline">Add to Weekly Plan</Button>
          <Button variant="coral">Generate Grocery List</Button>
        </div>
      </div>
      <div className="space-y-4">
        {parsed.map((item) => (
          <IngredientReviewTable key={item.recipe.id} planned={item} />
        ))}
      </div>
    </div>
  );
}
