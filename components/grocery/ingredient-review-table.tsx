"use client";

import { Trash2 } from "lucide-react";
import type { Ingredient, PlannedRecipe } from "@/types";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Button } from "@/components/ui/button";
import { EditItemModal } from "@/components/edit-item-modal";

export function IngredientReviewTable({ planned, onUpdateIngredient, onDeleteIngredient }: { planned: PlannedRecipe; onUpdateIngredient: (name: string, updates: Partial<Ingredient>) => void; onDeleteIngredient: (name: string) => void }) {
  return (
    <div className="cozy-panel rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-cocoa">{planned.day}: {planned.recipe.name}</h3>
          <p className="text-sm text-muted-foreground">Review and edit extracted ingredients before saving.</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white/60">
        {planned.recipe.ingredients.length ? planned.recipe.ingredients.map((ingredient) => (
          <div key={`${planned.recipe.id}-${ingredient.name}`} className="grid gap-3 border-b px-3 py-3 last:border-0 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
            <span className="font-semibold capitalize text-cocoa">{ingredient.name}</span>
            <span className="text-sm text-muted-foreground">{ingredient.quantity} {ingredient.unit}</span>
            <FreshnessBadge mode={ingredient.buyingMode} />
            <div className="flex gap-2">
              <EditItemModal
                title={`Edit ${ingredient.name}`}
                fields={["name", "quantity", "unit", "category", "freshnessRule"]}
                values={{ name: ingredient.name, quantity: ingredient.quantity, unit: ingredient.unit, category: ingredient.category, freshnessRule: ingredient.freshnessRule ?? "" }}
                onSave={(values) => onUpdateIngredient(ingredient.name, {
                  name: String(values.name),
                  quantity: Number(values.quantity) || ingredient.quantity,
                  unit: String(values.unit),
                  category: String(values.category),
                  freshnessRule: String(values.freshnessRule)
                })}
              />
              <Button size="sm" variant="outline" onClick={() => onDeleteIngredient(ingredient.name)}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
            </div>
          </div>
        )) : <div className="p-4 text-sm text-muted-foreground">No ingredients detected yet. Add quantities manually or paste a more detailed recipe.</div>}
      </div>
    </div>
  );
}
