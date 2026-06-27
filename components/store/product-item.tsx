"use client";

import { ShoppingBasket } from "lucide-react";
import { motion } from "framer-motion";
import { usePantryQuest } from "@/lib/app-state";
import type { GroceryItem, GrocerySectionKey } from "@/types";

export function ProductItem({ item, sectionKey }: { item: GroceryItem; sectionKey: GrocerySectionKey }) {
  const { updateGroceryItem } = usePantryQuest();
  const owned = item.status === "have";
  const urgent = item.buyingMode === "same_day_fresh";
  return (
    <motion.button
      type="button"
      onClick={() => updateGroceryItem(sectionKey, item.name, { status: owned ? "need" : "have", suggestedAction: owned ? "Need to order" : "Added to owned/check pantry" })}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`group relative flex min-h-[72px] flex-col justify-between rounded-xl border p-2 text-left shadow-insetCozy hover:-translate-y-1 ${owned ? "bg-white/35 opacity-55" : urgent ? "bg-honey/35 shadow-[0_0_22px_rgba(240,191,82,.45)]" : "bg-cream/90"}`}
    >
      <span className="line-clamp-2 text-xs font-black capitalize text-cocoa">{item.name}</span>
      <span className="text-[11px] font-semibold text-cocoa/65">{item.quantity} {item.unit}</span>
      <ShoppingBasket className="absolute bottom-2 right-2 h-3.5 w-3.5 text-coral opacity-0 transition group-hover:opacity-100" />
    </motion.button>
  );
}
