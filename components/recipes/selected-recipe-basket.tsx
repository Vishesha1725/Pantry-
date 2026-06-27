"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, X } from "lucide-react";
import { usePantryQuest } from "@/lib/app-state";
import { Button } from "@/components/ui/button";

export function SelectedRecipeBasket() {
  const { selectedRecipes, unselectRecipe, createWeeklyPlan } = usePantryQuest();
  return (
    <motion.div layout initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky bottom-4 z-20 rounded-2xl border bg-cocoa/95 p-4 text-cream shadow-cozy">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className="text-sm font-bold text-honey">Weekly basket</p>
          <p className="text-xs text-cream/75">{selectedRecipes.length ? `${selectedRecipes.length}/7 recipes selected` : "Pick recipes to start planning."}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2">
          <AnimatePresence>
            {selectedRecipes.map((recipe) => (
              <motion.span key={recipe.id} layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="inline-flex items-center gap-2 rounded-full bg-cream/15 px-3 py-1 text-xs font-bold">
                {recipe.name}
                <button type="button" onClick={() => unselectRecipe(recipe.id)} aria-label={`Remove ${recipe.name}`}><X className="h-3.5 w-3.5" /></button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <Button variant="coral" onClick={createWeeklyPlan} disabled={!selectedRecipes.length}>
          <CalendarCheck className="h-4 w-4" />
          <Link href="/meal-plan">Create Weekly Plan</Link>
        </Button>
      </div>
    </motion.div>
  );
}
