import Link from "next/link";
import { CalendarPlus, Clock, Eye, Plus, X } from "lucide-react";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe } from "@/types";

export function RecipeCard({ recipe, selected = false, onSelect, onAddToPlan }: { recipe: Recipe; selected?: boolean; onSelect?: () => void; onAddToPlan?: () => void }) {
  return (
    <Card className={`group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-cozy ${selected ? "ring-2 ring-coral" : ""}`}>
      <div className="h-2 bg-gradient-to-r from-sage via-honey to-coral" />
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <Link href={`/recipes/${recipe.id}`} className="leading-tight hover:text-coral"><CardTitle>{recipe.name}</CardTitle></Link>
          <FreshnessBadge mode={recipe.ingredients[0]?.buyingMode ?? "recipe_based"} />
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{recipe.prepTime} min</span>
          <span>{recipe.mealType}</span>
          <span>{recipe.cuisine}</span>
          <span>{recipe.proteinLevel.replace("_", " ")} protein</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm text-muted-foreground">Protein: <strong className="text-cocoa">{recipe.mainProtein}</strong>. Freshness: {recipe.freshnessRequirement}.</p>
        <div className="flex flex-wrap gap-2">
          {recipe.tags.slice(0, 5).map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
        <div className="mt-auto grid gap-2 sm:grid-cols-3">
          <Button type="button" variant={selected ? "coral" : "default"} className="sm:col-span-1" onClick={onSelect}>
            {selected ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{selected ? "Unselect" : "Select"}
          </Button>
          <Button type="button" variant="secondary" onClick={onAddToPlan}><CalendarPlus className="h-4 w-4" />Plan</Button>
          <Button asChild variant="outline"><Link href={`/recipes/${recipe.id}`}><Eye className="h-4 w-4" />Details</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
