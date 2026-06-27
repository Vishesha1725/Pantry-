"use client";

import Link from "next/link";
import { ClipboardList, PackageCheck, ShoppingBasket, Sparkles } from "lucide-react";
import { CozyStoreScene } from "@/components/store/cozy-store-scene";
import { EmptyState } from "@/components/empty-state";
import { GrocerySection } from "@/components/grocery/grocery-section";
import { Nav } from "@/components/nav";
import { PantryItemCard } from "@/components/pantry/pantry-item-card";
import { QuestPanel } from "@/components/quest-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePantryQuest } from "@/lib/app-state";

export default function DashboardPage() {
  const { weeklyPlan, pantryItems, grocerySections, selectedRecipeIds, loadDemoData, resetAppData } = usePantryQuest();
  const neededCount = grocerySections.weeklyFresh.length + grocerySections.monthlyStaples.length + grocerySections.quarterlyBulk.length + Object.values(grocerySections.sameDayByDate).flat().length;
  const hasGroceries = neededCount + grocerySections.todayFresh.length + grocerySections.checkPantry.length > 0;

  return (
    <>
      <Nav />
      <main className="cozy-grid mx-auto max-w-7xl px-4 py-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="cozy-panel overflow-hidden rounded-3xl p-0">
              <div className="bg-[linear-gradient(135deg,rgba(141,172,123,.28),rgba(240,191,82,.22),rgba(217,127,109,.18))] p-6 md:p-8">
                <p className="text-sm font-bold uppercase tracking-[.18em] text-sage">Cozy grocery world</p>
                <h1 className="mt-2 max-w-4xl text-4xl font-black text-cocoa md:text-6xl">Plan meals, stock wisely, and keep fresh food fresh.</h1>
                <p className="mt-4 max-w-2xl text-muted-foreground">A vegetarian, high-protein grocery quest with same-day paneer reminders, pantry checks, and editable weekly planning.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild><Link href="/recipes"><Sparkles className="h-4 w-4" />Pick Weekly Recipes</Link></Button>
                  <Button asChild variant="secondary"><Link href="/inbox"><ClipboardList className="h-4 w-4" />Paste Recipe</Link></Button>
                  <Button asChild variant="coral"><Link href="/grocery"><ShoppingBasket className="h-4 w-4" />Open Grocery Store</Link></Button>
                  <Button asChild variant="outline"><Link href="/pantry"><PackageCheck className="h-4 w-4" />Check Pantry</Link></Button>
                  <Button variant="outline" onClick={loadDemoData}>Load Demo Data</Button>
                  <Button variant="ghost" onClick={resetAppData}>Reset App Data</Button>
                </div>
              </div>
            </div>
            {hasGroceries ? <CozyStoreScene sections={grocerySections} /> : <EmptyState title="Your store is ready" description="Select recipes and generate groceries to fill the cozy shelves." action={<Button asChild><Link href="/recipes">Start Recipe Quest</Link></Button>} />}
          </div>
          <QuestPanel selectedCount={selectedRecipeIds.length} plannedCount={weeklyPlan.length} neededCount={neededCount} />
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>This week's selected recipes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {weeklyPlan.length ? weeklyPlan.map((item) => <div key={item.recipe.id} className="rounded-xl bg-white/65 p-3 text-sm"><strong>{item.day}</strong> · {item.recipe.name}</div>) : <EmptyState title="No plan yet" description="Pick recipes to create your week." className="p-4" />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Today's fresh order</CardTitle></CardHeader>
            <CardContent>
              <GrocerySection title="Fresh Counter" items={grocerySections.todayFresh} sectionKey="todayFresh" accent="bg-honey" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Pantry alerts</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {pantryItems.length ? pantryItems.slice(0, 3).map((item) => <PantryItemCard key={item.id} item={item} />) : <EmptyState title="Pantry is empty" description="Add pantry items or load demo data." className="p-4" />}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
