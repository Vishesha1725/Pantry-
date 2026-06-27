"use client";

import type { GroceryItem, GrocerySectionKey } from "@/types";
import { usePantryQuest } from "@/lib/app-state";

const lanes = [
  { id: "have", title: "I Have This", action: "Already available at home" },
  { id: "need", title: "Order Now", action: "Need to order" },
  { id: "same_day_fresh", title: "Order Fresh on Cooking Day", action: "Order same-day before cooking" },
  { id: "monthly_staple", title: "Monthly Staple", action: "Add to monthly refill" },
  { id: "ignored", title: "Skip", action: "Skipped for this grocery run" }
] as const;

type DragPayload = {
  sectionKey: GrocerySectionKey;
  name: string;
};

export function GroceryDragBoard({ items }: { items: Array<GroceryItem & { sectionKey: GrocerySectionKey }> }) {
  const { updateGroceryItem } = usePantryQuest();
  const onDrop = (lane: (typeof lanes)[number], payload: DragPayload) => {
    if (lane.id === "same_day_fresh" || lane.id === "monthly_staple") {
      updateGroceryItem(payload.sectionKey, payload.name, { buyingMode: lane.id, status: "need", suggestedAction: lane.action });
    } else {
      updateGroceryItem(payload.sectionKey, payload.name, { status: lane.id, suggestedAction: lane.action });
    }
  };

  return (
    <section className="cozy-panel rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="text-xl font-black text-cocoa">Drag grocery decisions</h2>
        <p className="text-sm text-muted-foreground">Move items between lanes to update cart status.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        {lanes.map((lane) => (
          <div
            key={lane.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const payload = JSON.parse(event.dataTransfer.getData("application/json")) as DragPayload;
              onDrop(lane, payload);
            }}
            className="min-h-[180px] rounded-2xl border border-dashed bg-white/45 p-3"
          >
            <h3 className="mb-3 text-sm font-black text-cocoa">{lane.title}</h3>
            <div className="space-y-2">
              {items
                .filter((item) => lane.id === item.status || lane.id === item.buyingMode)
                .slice(0, 8)
                .map((item) => (
                  <div
                    draggable
                    key={`${lane.id}-${item.sectionKey}-${item.name}`}
                    onDragStart={(event) => event.dataTransfer.setData("application/json", JSON.stringify({ sectionKey: item.sectionKey, name: item.name }))}
                    className="cursor-grab rounded-xl bg-cream p-2 text-xs font-bold capitalize text-cocoa shadow-insetCozy transition hover:-translate-y-0.5 active:cursor-grabbing"
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
