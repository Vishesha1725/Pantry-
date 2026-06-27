import { Award, Flame, Leaf, ShoppingBasket } from "lucide-react";
import { CozyProgressBar } from "./cozy-progress-bar";

export function GroceryQuestCard() {
  const badges = [
    { label: "Freshness Queen", icon: Leaf },
    { label: "Pantry Saver", icon: Award },
    { label: "Protein Planned", icon: Flame },
    { label: "Grocery Run Complete", icon: ShoppingBasket }
  ];
  return (
    <div className="cozy-panel rounded-2xl p-5">
      <h2 className="text-xl font-black text-cocoa">Weekly grocery quest</h2>
      <p className="mt-1 text-sm text-muted-foreground">Plan meals, check pantry, then fill the cart only with what is still needed.</p>
      <div className="mt-5"><CozyProgressBar value={72} /></div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {badges.map((badge) => <div key={badge.label} className="flex items-center gap-2 rounded-xl bg-white/65 p-3 text-sm font-bold text-cocoa"><badge.icon className="h-4 w-4 text-sage" />{badge.label}</div>)}
      </div>
    </div>
  );
}
