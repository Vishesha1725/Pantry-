import type { GroceryItem, GrocerySectionKey } from "@/types";
import { ProductItem } from "./product-item";

export function StoreShelf({ title, items, sectionKey, tone }: { title: string; items: GroceryItem[]; sectionKey: GrocerySectionKey; tone: string }) {
  return (
    <div className="rounded-2xl border border-cocoa/15 bg-[#8b5f43] p-3 shadow-cozy">
      <div className={`mb-3 rounded-xl px-3 py-2 text-sm font-black text-cocoa ${tone}`}>{title}</div>
      <div className="rounded-xl bg-[#b98559] p-2">
        <div className="grid grid-cols-3 gap-2 border-b-4 border-[#7a4d33] pb-3">
          {items.slice(0, 6).map((item) => <ProductItem key={`${title}-${item.name}`} item={item} sectionKey={sectionKey} />)}
          {!items.length && <div className="col-span-3 rounded-xl border border-dashed border-cream/50 bg-cream/20 p-4 text-center text-xs font-bold text-cream">Shelf is clear</div>}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {items.slice(6, 12).map((item) => <ProductItem key={`${title}-${item.name}`} item={item} sectionKey={sectionKey} />)}
        </div>
      </div>
    </div>
  );
}
