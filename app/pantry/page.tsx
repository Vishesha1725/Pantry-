import { Nav } from "@/components/nav";
import { PantryItemCard } from "@/components/pantry/pantry-item-card";
import { Button } from "@/components/ui/button";
import { samplePantry } from "@/lib/seed-recipes";

export default function PantryPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 cozy-panel rounded-2xl p-5">
          <div>
            <h1 className="text-3xl font-black text-cocoa">Pantry Tracker</h1>
            <p className="mt-2 text-muted-foreground">Track freshness, low stock, buying mode, shelf life, storage, daily use, thresholds, and notes.</p>
          </div>
          <Button>Add pantry item</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {samplePantry.map((item) => <PantryItemCard key={item.id} item={item} />)}
        </div>
      </main>
    </>
  );
}
