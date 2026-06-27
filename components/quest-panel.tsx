import { Award, ListChecks, ShoppingBasket, Sparkles } from "lucide-react";
import { CozyProgressBar } from "./cozy-progress-bar";

export function QuestPanel({ selectedCount, plannedCount, neededCount }: { selectedCount: number; plannedCount: number; neededCount: number }) {
  const progress = Math.round(((selectedCount ? 25 : 0) + (plannedCount ? 35 : 0) + (neededCount ? 40 : 0)));
  return (
    <div className="cozy-panel rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-coral/20 text-coral"><Sparkles className="h-5 w-5" /></span>
        <div>
          <h2 className="text-xl font-black text-cocoa">Weekly Quest</h2>
          <p className="text-sm text-muted-foreground">Pick recipes, plan days, then fill the cart.</p>
        </div>
      </div>
      <div className="mt-5"><CozyProgressBar value={progress} label="Quest progress" /></div>
      <div className="mt-5 grid gap-2">
        <div className="flex items-center justify-between rounded-xl bg-white/65 p-3 text-sm font-bold text-cocoa"><ListChecks className="h-4 w-4 text-sage" />Recipes selected <span>{selectedCount}/7</span></div>
        <div className="flex items-center justify-between rounded-xl bg-white/65 p-3 text-sm font-bold text-cocoa"><Award className="h-4 w-4 text-honey" />Days planned <span>{plannedCount}/7</span></div>
        <div className="flex items-center justify-between rounded-xl bg-white/65 p-3 text-sm font-bold text-cocoa"><ShoppingBasket className="h-4 w-4 text-coral" />Cart items <span>{neededCount}</span></div>
      </div>
    </div>
  );
}
