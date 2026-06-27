import Link from "next/link";
import { Clock, Plus } from "lucide-react";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe } from "@/types";

export function RecipeCard({ recipe, selected = false }: { recipe: Recipe; selected?: boolean }) {
  return (
    <Card className="group flex h-full flex-col hover:-translate-y-1 hover:shadow-cozy">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="leading-tight">{recipe.name}</CardTitle>
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
        <div className="mt-auto flex gap-2">
          <Button asChild variant={selected ? "coral" : "default"} className="flex-1">
            <Link href="/meal-plan"><Plus className="h-4 w-4" />{selected ? "Selected" : "Select Recipe"}</Link>
          </Button>
          <Button asChild variant="outline"><Link href={`/recipes/${recipe.id}`}>Details</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
