import { Badge } from "@/components/ui/badge";
import type { BuyingMode } from "@/types";

const labels: Record<BuyingMode, string> = {
  same_day_fresh: "Order same-day",
  daily_use: "Daily fresh",
  weekly_fresh: "Weekly fresh",
  monthly_staple: "Monthly staple",
  quarterly_bulk: "Quarterly bulk",
  recipe_based: "Recipe based",
  one_time: "One time"
};

export function FreshnessBadge({ mode }: { mode: BuyingMode }) {
  return <Badge className="bg-white/70">{labels[mode]}</Badge>;
}
