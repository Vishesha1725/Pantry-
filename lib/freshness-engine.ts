import type { BuyingMode, GroceryItem, Ingredient, PantryItem } from "@/types";

export function daysUntil(date?: string, now = new Date()) {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

export function isExpired(item: PantryItem, now = new Date()) {
  const days = daysUntil(item.expiryDate, now);
  return days !== null && days < 0;
}

export function isExpiringSoon(item: PantryItem, now = new Date()) {
  const days = daysUntil(item.expiryDate, now);
  return days !== null && days >= 0 && days <= Math.min(3, Math.ceil(item.shelfLifeDays * 0.25));
}

export function isLowStock(item: PantryItem) {
  if (item.stockStatus === "low_stock" || item.stockStatus === "out_of_stock") return true;
  if (!item.reorderThresholdQuantity) return false;
  return item.quantity <= item.reorderThresholdQuantity;
}

export function daysOfStockRemaining(item: PantryItem) {
  if (!item.dailyUsageQuantity) return null;
  return Math.floor(item.quantity / item.dailyUsageQuantity);
}

export function isFreshEnough(item: PantryItem | undefined, ingredient: Ingredient, now = new Date()) {
  if (!item) return false;
  if (item.freshnessPriority === "non_food" || ingredient.buyingMode === "monthly_staple") return !isLowStock(item);
  if (isExpired(item, now)) return false;
  if (ingredient.buyingMode === "same_day_fresh") return false;
  return !isExpiringSoon(item, now);
}

export function decideBuyingMode(ingredient: Pick<Ingredient, "name" | "category" | "buyingMode">): BuyingMode {
  const name = ingredient.name.toLowerCase();
  if (["paneer", "coriander", "mint", "lettuce", "spinach", "methi", "sprouted moong"].some((term) => name.includes(term))) return "same_day_fresh";
  if (["curd", "milk"].some((term) => name.includes(term))) return "daily_use";
  if (["fruit", "tomato", "onion", "cucumber", "lemon", "chilli", "ginger", "garlic", "bread", "wrap"].some((term) => name.includes(term))) return "weekly_fresh";
  if (["detergent", "garbage", "foil", "cleaning", "toiletries"].some((term) => name.includes(term))) return "quarterly_bulk";
  if (["rice", "atta", "dal", "pasta", "oats", "besan", "rajma", "chana", "spice", "oil", "peanut", "seed"].some((term) => name.includes(term) || ingredient.category.includes(term))) return "monthly_staple";
  return ingredient.buyingMode;
}

export function suggestedActionFor(item: GroceryItem) {
  if (item.status === "have") return "Already available at home";
  if (item.status === "low") return "Top up quantity";
  if (item.status === "stale") return "Replace before cooking";
  if (item.buyingMode === "same_day_fresh") return "Order same-day before cooking";
  if (item.buyingMode === "daily_use") return "Add to daily fresh run";
  if (item.buyingMode === "weekly_fresh") return "Add to weekly fresh basket";
  if (item.buyingMode === "monthly_staple") return "Check pantry, then monthly refill";
  if (item.buyingMode === "quarterly_bulk") return "Add to quarterly bulk list";
  return "Buy only if this recipe stays selected";
}
