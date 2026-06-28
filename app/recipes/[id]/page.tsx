import { notFound } from "next/navigation";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { RecipeDetailActions } from "@/components/recipes/recipe-detail-actions";
import { seedRecipes } from "@/lib/seed-recipes";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = seedRecipes.find((item) => item.id === id);
  if (!recipe) notFound();
  const fresh = recipe.ingredients.filter((item) => item.buyingMode === "same_day_fresh" || item.buyingMode === "weekly_fresh");
  const pantry = recipe.ingredients.filter((item) => item.buyingMode === "monthly_staple" || item.buyingMode === "recipe_based");
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="cozy-panel rounded-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-cocoa">{recipe.name}</h1>
              <p className="mt-2 text-muted-foreground">{recipe.cuisine} · {recipe.mealType} · {recipe.prepTime} min · {recipe.mainProtein}</p>
            </div>
            <RecipeDetailActions recipe={recipe} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">{recipe.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="cozy-panel rounded-2xl p-5">
            <h2 className="text-xl font-black text-cocoa">Ingredients</h2>
            <div className="mt-4 space-y-3">
              {recipe.ingredients.map((item) => <div key={item.name} className="flex items-center justify-between rounded-xl bg-white/65 p-3"><span>{item.quantity} {item.unit} {item.name}</span><FreshnessBadge mode={item.buyingMode} /></div>)}
            </div>
          </section>
          <section className="cozy-panel rounded-2xl p-5">
            <h2 className="text-xl font-black text-cocoa">Instructions</h2>
            <ol className="mt-4 space-y-3">
              {recipe.instructions.map((step, index) => <li key={step} className="rounded-xl bg-white/65 p-3"><strong>{index + 1}.</strong> {step}</li>)}
            </ol>
          </section>
          <section className="cozy-panel rounded-2xl p-5">
            <h2 className="text-xl font-black text-cocoa">Grocery impact</h2>
            <p className="mt-2 text-sm text-muted-foreground">{fresh.length} fresh items and {pantry.length} pantry items will be checked before ordering.</p>
            <div className="mt-4"><RecipeDetailActions recipe={recipe} /></div>
          </section>
          <section className="cozy-panel rounded-2xl p-5">
            <h2 className="text-xl font-black text-cocoa">Fresh ingredients needed</h2>
            <p className="mt-2 text-sm text-muted-foreground">{fresh.map((item) => item.name).join(", ") || "None"}</p>
            <h2 className="mt-5 text-xl font-black text-cocoa">Pantry ingredients needed</h2>
            <p className="mt-2 text-sm text-muted-foreground">{pantry.map((item) => item.name).join(", ") || "None"}</p>
          </section>
        </div>
      </main>
    </>
  );
}
