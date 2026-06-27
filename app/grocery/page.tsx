import { ThreeDStore } from "@/components/3d";
import { GrocerySection } from "@/components/grocery/grocery-section";
import { Nav } from "@/components/nav";
import { grocerySections } from "@/lib/demo-data";

export default function GroceryPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 cozy-panel rounded-2xl p-5">
          <h1 className="text-3xl font-black text-cocoa">Grocery Generator</h1>
          <p className="mt-2 text-muted-foreground">Merged ingredients are compared with pantry stock, freshness, and cooking dates before they become an order list.</p>
        </div>
        <ThreeDStore sections={grocerySections} />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <GrocerySection title="Today’s Fresh Order" items={grocerySections.todayFresh} accent="bg-honey" />
          {Object.entries(grocerySections.sameDayByDate).map(([date, items]) => <GrocerySection key={date} title={`Same-Day Fresh: ${date}`} items={items} accent="bg-coral" />)}
          <GrocerySection title="Weekly Fresh Grocery" items={grocerySections.weeklyFresh} accent="bg-sage" />
          <GrocerySection title="Monthly Staples" items={grocerySections.monthlyStaples} accent="bg-cocoa" />
          <GrocerySection title="Quarterly Bulk" items={grocerySections.quarterlyBulk} accent="bg-lavender" />
          <GrocerySection title="Check Pantry" items={grocerySections.checkPantry} accent="bg-honey" />
          <GrocerySection title="Optional Items" items={grocerySections.optional} />
          <GrocerySection title="Ignored Items" items={grocerySections.ignored} />
        </div>
      </main>
    </>
  );
}
