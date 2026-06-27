import Link from "next/link";
import { ClipboardList, PackageCheck, ShoppingBasket, Sparkles, Store } from "lucide-react";
import { ThreeDStore } from "@/components/3d";
import { CozyProgressBar } from "@/components/cozy-progress-bar";
import { GroceryQuestCard } from "@/components/grocery-quest-card";
import { GrocerySection } from "@/components/grocery/grocery-section";
import { Nav } from "@/components/nav";
import { PantryItemCard } from "@/components/pantry/pantry-item-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { grocerySections, weeklyPlan } from "@/lib/demo-data";
import { samplePantry } from "@/lib/seed-recipes";

export default function DashboardPage() {
  const expiring = samplePantry.filter((item) => item.stockStatus !== "in_stock" || item.expiryDate);
  return (
    <>
      <Nav />
      <main className="cozy-grid mx-auto max-w-7xl px-4 py-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="cozy-panel rounded-3xl p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-sage">Weekly quest board</p>
              <h1 className="mt-2 text-4xl font-black text-cocoa md:text-6xl">Plan cozy vegetarian meals with a smarter grocery run.</h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">High-protein, PCOS-friendly, thyroid-friendly ideas with no soya, tofu, or mushrooms. Fresh ingredients stay fresh because the app separates same-day, weekly, monthly, and bulk buying.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild><Link href="/recipes"><Sparkles className="h-4 w-4" />Pick Weekly Recipes</Link></Button>
                <Button asChild variant="secondary"><Link href="/inbox"><ClipboardList className="h-4 w-4" />Paste My Own Recipe</Link></Button>
                <Button asChild variant="coral"><Link href="/grocery"><ShoppingBasket className="h-4 w-4" />Generate Grocery List</Link></Button>
                <Button asChild variant="outline"><Link href="/pantry"><PackageCheck className="h-4 w-4" />Check Pantry</Link></Button>
              </div>
            </div>
            <ThreeDStore sections={grocerySections} />
          </div>
          <GroceryQuestCard />
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>This week’s selected recipes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {weeklyPlan.map((item) => <div key={item.recipe.id} className="rounded-xl bg-white/65 p-3 text-sm"><strong>{item.day}</strong> · {item.recipe.name}</div>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Grocery completion</CardTitle></CardHeader>
            <CardContent><CozyProgressBar value={64} label="Needed items sorted" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Fresh + pantry alerts</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {expiring.slice(0, 3).map((item) => <PantryItemCard key={item.id} item={item} />)}
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <GrocerySection title="Today’s Fresh Order" items={grocerySections.todayFresh} accent="bg-honey" />
          <GrocerySection title="Weekly Fresh Grocery" items={grocerySections.weeklyFresh.slice(0, 4)} accent="bg-sage" />
          <GrocerySection title="Monthly Staples" items={grocerySections.monthlyStaples.slice(0, 4)} accent="bg-cocoa" />
        </section>
      </main>
    </>
  );
}
