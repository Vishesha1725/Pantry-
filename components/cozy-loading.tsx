"use client";

import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";

export function CozyLoading({ label = "Preparing your weekly basket..." }: { label?: string }) {
  return (
    <div className="grid min-h-[280px] place-items-center">
      <div className="cozy-panel rounded-2xl p-6 text-center">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-honey/35 text-cocoa"
        >
          <ShoppingBasket className="h-6 w-6" />
        </motion.div>
        <p className="mt-4 text-sm font-black text-cocoa">{label}</p>
      </div>
    </div>
  );
}
