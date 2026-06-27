import type { PlannedRecipe } from "@/types";
import { FreshnessBadge } from "@/components/freshness-badge";

export function IngredientReviewTable({ planned }: { planned: PlannedRecipe }) {
  return (
    <div className="cozy-panel rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-cocoa">{planned.day}: {planned.recipe.name}</h3>
          <p className="text-sm text-muted-foreground">Review every extracted ingredient before saving.</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white/60">
        {planned.recipe.ingredients.length ? planned.recipe.ingredients.map((ingredient) => (
          <div key={`${planned.recipe.id}-${ingredient.name}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b px-3 py-2 last:border-0">
            <span className="font-semibold text-cocoa">{ingredient.name}</span>
            <span className="text-sm text-muted-foreground">{ingredient.quantity} {ingredient.unit}</span>
            <FreshnessBadge mode={ingredient.buyingMode} />
          </div>
        )) : <div className="p-4 text-sm text-muted-foreground">No ingredients detected yet. Add quantities manually or paste a more detailed recipe.</div>}
      </div>
    </div>
  );
}
