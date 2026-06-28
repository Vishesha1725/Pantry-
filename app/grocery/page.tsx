"use client";

import Link from "next/link";
import { WandSparkles } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { GroceryDragBoard } from "@/components/grocery/grocery-drag-board";
import { GrocerySection } from "@/components/grocery/grocery-section";
import { Nav } from "@/components/nav";
import { CozyStoreScene } from "@/components/store/cozy-store-scene";
import { Button } from "@/components/ui/button";
import { usePantryQuest } from "@/lib/app-state";

export default function GroceryPage() {
  const { grocerySections, weeklyPlan, generateGroceries, clearGroceryList } = usePantryQuest();
  const total = grocerySections.todayFresh.length
    + Object.values(grocerySections.sameDayByDate).flat().length
    + grocerySections.weeklyFresh.length
    + grocerySections.monthlyStaples.length
    + grocerySections.quarterlyBulk.length
    + grocerySections.checkPantry.length
    + grocerySections.optional.length;
  const dragItems = [
    ...grocerySections.todayFresh.map((item) => ({ ...item, sectionKey: "todayFresh" as const })),
    ...Object.entries(grocerySections.sameDayByDate).flatMap(([date, items]) => items.map((item) => ({ ...item, sectionKey: `sameDayByDate:${date}` as const }))),
    ...grocerySections.weeklyFresh.map((item) => ({ ...item, sectionKey: "weeklyFresh" as const })),
    ...grocerySections.monthlyStaples.map((item) => ({ ...item, sectionKey: "monthlyStaples" as const })),
    ...grocerySections.quarterlyBulk.map((item) => ({ ...item, sectionKey: "quarterlyBulk" as const })),
    ...grocerySections.checkPantry.map((item) => ({ ...item, sectionKey: "checkPantry" as const })),
    ...grocerySections.optional.map((item) => ({ ...item, sectionKey: "optional" as const }))
  ];
  const finalOrderItems = dragItems.filter((item) => item.status !== "have" && item.status !== "ignored");

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 cozy-panel rounded-2xl p-5">
          <div>
            <h1 className="text-3xl font-black text-cocoa">Grocery Generator</h1>
            <p className="mt-2 text-muted-foreground">Merged ingredients are compared with pantry stock, freshness, and cooking dates before they become an order list.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateGroceries} disabled={!weeklyPlan.length}><WandSparkles className="h-4 w-4" />Generate Grocery List</Button>
            <Button variant="outline" onClick={clearGroceryList} disabled={!total}>Clear Grocery List</Button>
          </div>
        </div>
        {!weeklyPlan.length && !total ? (
          <EmptyState title="No grocery quest yet" description="Select recipes and create a weekly plan before generating groceries." action={<Button asChild><Link href="/recipes">Pick Weekly Recipes</Link></Button>} />
        ) : (
          <>
            <CozyStoreScene sections={grocerySections} />
            <section className="mt-6 cozy-panel rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-cocoa">Final Order List</h2>
                  <p className="text-sm text-muted-foreground">Only items still needed remain here.</p>
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-cocoa">{finalOrderItems.length}</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {finalOrderItems.length ? finalOrderItems.map((item) => (
                  <div key={`final-${item.sectionKey}-${item.name}`} className="rounded-xl bg-white/70 p-3 text-sm font-semibold capitalize text-cocoa">
                    {item.name} <span className="text-muted-foreground">· {item.quantity} {item.unit}</span>
                  </div>
                )) : <p className="rounded-xl bg-white/60 p-4 text-sm text-muted-foreground">Nothing left to order.</p>}
              </div>
            </section>
            <div className="mt-6"><GroceryDragBoard items={dragItems} /></div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <GrocerySection title="Today's Fresh Order" items={grocerySections.todayFresh} sectionKey="todayFresh" accent="bg-honey" />
              {Object.entries(grocerySections.sameDayByDate).map(([date, items]) => <GrocerySection key={date} title={`Same-Day Fresh: ${date}`} items={items} sectionKey={`sameDayByDate:${date}`} accent="bg-coral" />)}
              <GrocerySection title="Weekly Fresh Grocery" items={grocerySections.weeklyFresh} sectionKey="weeklyFresh" accent="bg-sage" />
              <GrocerySection title="Monthly Staples" items={grocerySections.monthlyStaples} sectionKey="monthlyStaples" accent="bg-cocoa" />
              <GrocerySection title="Quarterly Bulk" items={grocerySections.quarterlyBulk} sectionKey="quarterlyBulk" accent="bg-lavender" />
              <GrocerySection title="Check Pantry" items={grocerySections.checkPantry} sectionKey="checkPantry" accent="bg-honey" />
              <GrocerySection title="Optional Items" items={grocerySections.optional} sectionKey="optional" />
              <GrocerySection title="Ignored Items" items={grocerySections.ignored} sectionKey="ignored" />
            </div>
          </>
        )}
      </main>
    </>
  );
}
