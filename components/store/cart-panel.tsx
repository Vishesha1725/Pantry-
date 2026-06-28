"use client";

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export function CartPanel({ count }: { count: number }) {
  return (
    <motion.aside layout animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.45 }} className="rounded-2xl border bg-cocoa p-4 text-cream shadow-cozy">
      <div className="flex items-center gap-3">
        <motion.span animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }} className="grid h-12 w-12 place-items-center rounded-2xl bg-coral text-white"><ShoppingCart className="h-6 w-6" /></motion.span>
        <div>
          <p className="text-sm font-bold text-honey">Checkout Review Cart</p>
          <h3 className="text-2xl font-black">{count} needed</h3>
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream/20">
        <div className="h-full rounded-full bg-gradient-to-r from-sage via-honey to-coral" style={{ width: `${Math.min(100, count * 8)}%` }} />
      </div>
    </motion.aside>
  );
}
