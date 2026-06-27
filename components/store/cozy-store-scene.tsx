import type { GrocerySections } from "@/types";
import { CartPanel } from "./cart-panel";
import { StoreShelf } from "./store-shelf";

export function CozyStoreScene({ sections }: { sections: GrocerySections }) {
  const sameDay = Object.values(sections.sameDayByDate).flat();
  const neededCount = [...sameDay, ...sections.todayFresh, ...sections.weeklyFresh, ...sections.monthlyStaples, ...sections.quarterlyBulk]
    .filter((item) => item.status !== "have" && item.status !== "ignored").length;
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-[linear-gradient(180deg,#fff2d6,#e7c69c)] p-4 shadow-cozy">
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.8),transparent_65%)]" />
      <div className="relative grid gap-4 xl:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream/80 p-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.16em] text-sage">Weekly Quest</p>
              <h2 className="text-2xl font-black text-cocoa">Pick your groceries</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">Click products to toggle them as handled. Urgent same-day items glow softly, and owned items fade.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <StoreShelf title="Fresh Counter" items={[...sections.todayFresh, ...sameDay]} sectionKey="todayFresh" tone="bg-honey/70" />
            <StoreShelf title="Weekly Garden Aisle" items={sections.weeklyFresh} sectionKey="weeklyFresh" tone="bg-sage/40" />
            <StoreShelf title="Pantry Staples Shelf" items={sections.monthlyStaples} sectionKey="monthlyStaples" tone="bg-cream/80" />
            <StoreShelf title="Bulk Storage Corner" items={sections.quarterlyBulk} sectionKey="quarterlyBulk" tone="bg-lavender/40" />
            <StoreShelf title="Recipe Basket Station" items={sections.checkPantry} sectionKey="checkPantry" tone="bg-coral/20" />
          </div>
        </div>
        <CartPanel count={neededCount} />
      </div>
    </section>
  );
}
