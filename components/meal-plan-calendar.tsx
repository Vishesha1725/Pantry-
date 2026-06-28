"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { days, usePantryQuest } from "@/lib/app-state";
import { EmptyState } from "./empty-state";
import { FreshnessBadge } from "./freshness-badge";
import { Button } from "./ui/button";

export function MealPlanCalendar() {
  const { weeklyPlan, movePlannedRecipe, removePlannedRecipe, clearWeeklyPlan, generateGroceries } = usePantryQuest();
  const router = useRouter();
  const complete = new Set(weeklyPlan.map((item) => item.day)).size >= 7;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary"><Link href="/recipes"><Plus className="h-4 w-4" />Add another recipe</Link></Button>
        <Button
          variant="coral"
          disabled={!weeklyPlan.length}
          onClick={() => {
            generateGroceries();
            router.push("/grocery");
          }}
        >
          <ShoppingBasket className="h-4 w-4" />Generate Grocery List
        </Button>
        <Button variant="outline" onClick={clearWeeklyPlan} disabled={!weeklyPlan.length}>Clear Weekly Plan</Button>
      </div>
      <AnimatePresence>
        {complete && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-honey/40 bg-honey/20 p-4 text-sm font-black text-cocoa shadow-insetCozy">
            Weekly plan complete. Your grocery quest is ready for checkout review.
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-4 lg:grid-cols-7">
        {days.map((day) => {
          const plannedItems = weeklyPlan.filter((item) => item.day === day);
          return (
            <motion.div key={day} layout whileHover={{ y: -4 }} className="cozy-panel min-h-[250px] rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-2 font-black text-cocoa"><CalendarDays className="h-4 w-4 text-sage" />{day}</div>
              {plannedItems.length ? (
                <div className="space-y-3">
                  {plannedItems.map((planned) => (
                    <motion.div key={planned.recipe.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-white/75 p-3 shadow-insetCozy">
                      <h3 className="font-bold text-cocoa">{planned.recipe.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{planned.slot} · {planned.recipe.prepTime} min · {planned.recipe.mainProtein}</p>
                      <div className="mt-3"><FreshnessBadge mode={planned.recipe.ingredients[0]?.buyingMode ?? "recipe_based"} /></div>
                      <select className="mt-4 w-full rounded-lg border bg-cream p-2 text-sm" value={planned.day} onChange={(event) => movePlannedRecipe(planned.recipe.id, event.target.value)}>
                        {days.map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <Button className="mt-3 w-full" size="sm" variant="outline" onClick={() => removePlannedRecipe(planned.recipe.id)}><Trash2 className="h-3.5 w-3.5" />Remove</Button>
                    </motion.div>
                  ))}
                </div>
              ) : <EmptyState title="Open dinner slot" description="Add a recipe from your weekly basket." className="h-40" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
