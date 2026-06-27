import { Nav } from "@/components/nav";
import { WeeklyRecipePicker } from "@/components/recipes/weekly-recipe-picker";
import { seedRecipes, selectedRecipeIds } from "@/lib/seed-recipes";

export default function RecipesPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <WeeklyRecipePicker recipes={seedRecipes} initialSelected={selectedRecipeIds} />
      </main>
    </>
  );
}
