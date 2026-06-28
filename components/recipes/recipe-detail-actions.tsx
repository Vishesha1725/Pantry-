"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus, ShoppingBasket } from "lucide-react";
import { usePantryQuest } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types";

export function RecipeDetailActions({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const { addRecipesToPlan, addRecipesToPlanAndGenerate } = usePantryQuest();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => {
          addRecipesToPlan([recipe]);
          router.push("/plan");
        }}
      >
        <CalendarPlus className="h-4 w-4" />Add to this week
      </Button>
      <Button
        variant="coral"
        onClick={() => {
          addRecipesToPlanAndGenerate([recipe]);
          router.push("/grocery");
        }}
      >
        <ShoppingBasket className="h-4 w-4" />Generate grocery list
      </Button>
    </div>
  );
}
