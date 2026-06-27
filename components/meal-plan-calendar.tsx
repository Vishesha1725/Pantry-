"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { days } from "@/lib/demo-data";
import type { PlannedRecipe } from "@/types";
import { FreshnessBadge } from "./freshness-badge";

export function MealPlanCalendar({ plan }: { plan: PlannedRecipe[] }) {
  const [items, setItems] = useState(plan);
  return (
    <div className="grid gap-4 lg:grid-cols-7">
      {days.map((day) => {
        const planned = items.find((item) => item.day === day);
        return (
          <div key={day} className="cozy-panel min-h-[230px] rounded-2xl p-4">
            <div className="mb-3 flex items-center gap-2 font-black text-cocoa"><CalendarDays className="h-4 w-4 text-sage" />{day}</div>
            {planned ? (
              <div className="rounded-xl bg-white/70 p-3">
                <h3 className="font-bold text-cocoa">{planned.recipe.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{planned.slot} · {planned.recipe.prepTime} min · {planned.recipe.mainProtein}</p>
                <div className="mt-3"><FreshnessBadge mode={planned.recipe.ingredients[0]?.buyingMode ?? "recipe_based"} /></div>
                <select className="mt-4 w-full rounded-lg border bg-cream p-2 text-sm" value={planned.day} onChange={(event) => setItems((current) => current.map((item) => item.recipe.id === planned.recipe.id ? { ...item, day: event.target.value } : item))}>
                  {days.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            ) : <div className="grid h-36 place-items-center rounded-xl border border-dashed bg-white/40 text-center text-sm text-muted-foreground">Open recipe picker to place a cozy dinner here.</div>}
          </div>
        );
      })}
    </div>
  );
}
