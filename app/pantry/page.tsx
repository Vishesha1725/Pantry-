"use client";

import { Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Nav } from "@/components/nav";
import { PantryItemCard } from "@/components/pantry/pantry-item-card";
import { Button } from "@/components/ui/button";
import { usePantryQuest } from "@/lib/app-state";
import type { PantryItem } from "@/types";

function newPantryItem(): PantryItem {
  return {
    id: crypto.randomUUID(),
    name: "new pantry item",
    category: "pantry",
    quantity: 1,
    unit: "pack",
    buyingMode: "monthly_staple",
    shelfLifeDays: 90,
    storageType: "pantry",
    stockStatus: "in_stock",
    freshnessPriority: "medium",
    avoidStocking: false
  };
}

export default function PantryPage() {
  const { pantryItems, addPantryItem, loadDemoData } = usePantryQuest();
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 cozy-panel rounded-2xl p-5">
          <div>
            <h1 className="text-3xl font-black text-cocoa">Pantry Tracker</h1>
            <p className="mt-2 text-muted-foreground">Add, edit, delete, and track freshness, low stock, buying mode, shelf life, storage, daily use, thresholds, and notes.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => addPantryItem(newPantryItem())}><Plus className="h-4 w-4" />Add pantry item</Button>
            <Button variant="outline" onClick={loadDemoData}>Load Demo Data</Button>
          </div>
        </div>
        {pantryItems.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pantryItems.map((item) => <PantryItemCard key={item.id} item={item} editable />)}
          </div>
        ) : <EmptyState title="No pantry items yet" description="Start clean by adding your own pantry item, or use Load Demo Data to explore the app." />}
      </main>
    </>
  );
}
