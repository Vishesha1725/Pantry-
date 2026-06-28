"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CombinedGroceryItem, GroceryStatus, RecipeWiseGroceryItem } from "@/types";
import { usePantryQuest } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { FreshnessBadge } from "@/components/freshness-badge";
import { EditItemModal } from "@/components/edit-item-modal";
import { EmptyState } from "@/components/empty-state";

const actions: Array<{ label: string; status: GroceryStatus }> = [
  { label: "I have this", status: "have_at_home" },
  { label: "Need to order", status: "need_to_order" },
  { label: "Order fresh on recipe day", status: "order_fresh_on_day" },
  { label: "Move to monthly", status: "monthly_staple" },
  { label: "Skip", status: "skip" }
];

function statusBuyingMode(status: GroceryStatus, fallback: RecipeWiseGroceryItem["buyingMode"]) {
  if (status === "order_fresh_on_day") return "same_day_fresh";
  if (status === "monthly_staple") return "monthly_staple";
  if (status === "check_pantry") return "pantry_check";
  return fallback;
}

export function StructuredGrocery() {
  const [view, setView] = useState<"recipe" | "combined">("recipe");
  const {
    recipeWiseGroceryList,
    combinedGroceryList,
    updateRecipeWiseGroceryItem,
    updateCombinedGroceryItem,
    deleteRecipeWiseGroceryItem,
    deleteCombinedGroceryItem,
    addManualGroceryItem
  } = usePantryQuest();
  const hasItems = recipeWiseGroceryList.some((group) => group.ingredients.length) || combinedGroceryList.length > 0;

  if (!hasItems) {
    return <EmptyState title="No groceries generated yet" description="Select recipes, create a weekly plan, then generate groceries." />;
  }

  return (
    <section className="space-y-5">
      <div className="cozy-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div>
          <h2 className="text-xl font-black text-cocoa">Grocery Review</h2>
          <p className="text-sm text-muted-foreground">Start recipe-wise, then switch to the merged final list.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "recipe" ? "default" : "outline"} onClick={() => setView("recipe")}>By Recipe</Button>
          <Button variant={view === "combined" ? "default" : "outline"} onClick={() => setView("combined")}>Combined</Button>
          <Button variant="secondary" onClick={() => addManualGroceryItem()}><Plus className="h-4 w-4" />Manual item</Button>
        </div>
      </div>

      {view === "recipe" ? (
        <div className="grid gap-5">
          {recipeWiseGroceryList.map((group) => (
            <div key={group.recipeId} className="cozy-panel rounded-2xl p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-cocoa">{group.recipeName}</h3>
                  <p className="text-sm text-muted-foreground">{group.mealDay}</p>
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-cocoa">{group.ingredients.length} ingredients</span>
              </div>
              <div className="grid gap-3">
                {group.ingredients.map((item) => (
                  <div key={`${group.recipeId}-${item.id}`} className="rounded-2xl border bg-white/75 p-4 shadow-insetCozy">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="font-black capitalize text-cocoa">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.quantity} {item.unit} · {item.status.replaceAll("_", " ")}</p>
                      </div>
                      <FreshnessBadge mode={item.buyingMode} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {actions.map((action) => (
                        <Button
                          key={action.status}
                          size="sm"
                          variant={item.status === action.status ? "secondary" : "outline"}
                          onClick={() => updateRecipeWiseGroceryItem(group.recipeId, item.id, { status: action.status, buyingMode: statusBuyingMode(action.status, item.buyingMode) })}
                        >
                          {action.label}
                        </Button>
                      ))}
                      <EditItemModal
                        title={`Edit ${item.name}`}
                        fields={["name", "quantity", "unit", "category"]}
                        values={{ name: item.name, quantity: item.quantity, unit: item.unit, category: item.category }}
                        onSave={(values) => updateRecipeWiseGroceryItem(group.recipeId, item.id, {
                          name: String(values.name),
                          quantity: Number(values.quantity) || item.quantity,
                          unit: String(values.unit),
                          category: String(values.category)
                        })}
                      />
                      <Button size="sm" variant="outline" onClick={() => deleteRecipeWiseGroceryItem(group.recipeId, item.id)}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cozy-panel rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-xl font-black text-cocoa">Final Combined Order List</h3>
            <p className="text-sm text-muted-foreground">Duplicate pantry and weekly items are merged. Same-day paneer stays separate by recipe day.</p>
          </div>
          <div className="grid gap-3">
            {combinedGroceryList.map((item: CombinedGroceryItem) => (
              <div key={item.id} className={`rounded-2xl border bg-white/75 p-4 shadow-insetCozy ${item.status === "have_at_home" || item.status === "skip" ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-black capitalize text-cocoa">{item.ingredientName}</h4>
                    <p className="text-sm text-muted-foreground">{item.totalQuantity} {item.unit} · used in {item.usedInRecipes.join(", ")}</p>
                  </div>
                  <FreshnessBadge mode={item.buyingMode} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {actions.map((action) => (
                    <Button
                      key={action.status}
                      size="sm"
                      variant={item.status === action.status ? "secondary" : "outline"}
                      onClick={() => updateCombinedGroceryItem(item.id, { status: action.status, buyingMode: statusBuyingMode(action.status, item.buyingMode) })}
                    >
                      {action.label}
                    </Button>
                  ))}
                  <EditItemModal
                    title={`Edit ${item.ingredientName}`}
                    fields={["ingredientName", "totalQuantity", "unit", "category"]}
                    values={{ ingredientName: item.ingredientName, totalQuantity: item.totalQuantity, unit: item.unit, category: item.category }}
                    onSave={(values) => updateCombinedGroceryItem(item.id, {
                      ingredientName: String(values.ingredientName),
                      totalQuantity: Number(values.totalQuantity) || item.totalQuantity,
                      unit: String(values.unit),
                      category: String(values.category)
                    })}
                  />
                  <Button size="sm" variant="outline" onClick={() => deleteCombinedGroceryItem(item.id)}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
