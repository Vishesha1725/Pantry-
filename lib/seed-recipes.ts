import type { PantryItem, Recipe } from "@/types";

const fresh = "Order close to cooking or buy in a small weekly batch.";
const pantry = "Usually safe to keep as pantry stock.";

function ing(name: string, quantity: number, unit: string, category: string, buyingMode: Recipe["ingredients"][number]["buyingMode"], freshnessRule = pantry) {
  return { id: name.toLowerCase().replaceAll(" ", "-"), name, quantity, unit, category, buyingMode, freshnessRule };
}

const baseInstructions = [
  "Prep vegetables, rinse herbs, and measure pantry ingredients.",
  "Cook the protein and base with gentle spices until balanced.",
  "Finish with fresh herbs, curd, lemon, seeds, or peanuts as the recipe needs."
];

const recipeRows = [
  ["paneer-tikka-salad-bowl", "Crispy Paneer Caesar-Style Bowl", "bowl", "Fusion", 30, "very_high", "easy", "high", "paneer", ["high_protein", "salad", "bowl", "dinner", "filling"], [ing("paneer", 180, "g", "fresh dairy", "same_day_fresh", fresh), ing("lettuce", 1, "head", "vegetable", "same_day_fresh", fresh), ing("cucumber", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("hung curd", 100, "g", "fresh dairy", "weekly_fresh", fresh), ing("tikka masala", 2, "tsp", "spice", "monthly_staple")]],
  ["tomato-shorba-paneer", "Tomato Basil Shorba with Cheese Garlic Toast", "soup", "Indian", 25, "high", "easy", "high", "paneer", ["high_protein", "soup", "light", "dinner"], [ing("tomatoes", 3, "pc", "vegetable", "weekly_fresh", fresh), ing("cheese", 40, "g", "fresh dairy", "weekly_fresh", fresh), ing("bread", 2, "slices", "bakery", "weekly_fresh", fresh), ing("ginger", 1, "inch", "vegetable", "weekly_fresh", fresh), ing("cumin", 1, "tsp", "spice", "monthly_staple")]],
  ["mexican-rajma-bowl", "Mexican Rice Bowl with Rajma and Garlic Yogurt", "bowl", "Mexican", 35, "high", "easy", "medium", "rajma", ["high_protein", "bowl", "filling", "spicy", "dinner"], [ing("rajma", 0.75, "cup", "lentil", "monthly_staple"), ing("rice", 0.5, "cup", "grain", "monthly_staple"), ing("corn", 0.5, "cup", "vegetable", "weekly_fresh", fresh), ing("curd", 100, "g", "fresh dairy", "daily_use", fresh), ing("lettuce", 1, "cup", "vegetable", "same_day_fresh", fresh)]],
  ["thai-peanut-paneer-bowl", "Thai Peanut Paneer Noodle Bowl without Soy Sauce", "bowl", "Asian", 30, "very_high", "medium", "high", "paneer", ["high_protein", "bowl", "spicy", "dinner"], [ing("paneer", 180, "g", "fresh dairy", "same_day_fresh", fresh), ing("peanuts", 0.2, "cup", "nuts", "monthly_staple"), ing("coconut milk", 0.5, "cup", "pantry", "monthly_staple"), ing("bell pepper", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("lemon", 1, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["chana-veggie-soup", "Roasted Tomato Chana Soup with Crunchy Garlic Toast", "soup", "Fusion", 30, "high", "easy", "medium", "chana", ["high_protein", "soup", "light", "dinner"], [ing("chana", 0.75, "cup", "lentil", "monthly_staple"), ing("carrot", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("spinach", 2, "cups", "greens", "same_day_fresh", fresh), ing("garlic", 4, "cloves", "vegetable", "weekly_fresh", fresh)]],
  ["paneer-bhurji-wrap", "Spicy Corn Paneer Wrap", "dinner", "Fusion", 20, "very_high", "easy", "high", "paneer", ["high_protein", "quick", "low_effort", "dinner"], [ing("paneer", 180, "g", "fresh dairy", "same_day_fresh", fresh), ing("wraps", 2, "pc", "bakery", "weekly_fresh", fresh), ing("onions", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("tomatoes", 1, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["dal-palak-soup", "Garlicky Dal Palak Soup with Lemon Tempering", "soup", "Indian", 30, "high", "easy", "high", "moong dal", ["high_protein", "soup", "light", "dinner"], [ing("moong dal", 0.5, "cup", "lentil", "monthly_staple"), ing("spinach", 2, "cups", "greens", "same_day_fresh", fresh), ing("garlic", 3, "cloves", "vegetable", "weekly_fresh", fresh)]],
  ["masoor-dal-khichdi", "Golden Masoor Comfort Khichdi Bowl", "lunch", "Indian", 30, "high", "easy", "low", "masoor dal", ["comfort", "low_effort", "filling"], [ing("masoor dal", 0.5, "cup", "lentil", "monthly_staple"), ing("rice", 0.4, "cup", "grain", "monthly_staple"), ing("ghee", 1, "tsp", "fat", "monthly_staple")]],
  ["chana-chaat-curd", "Creamy Chana Taco Bowl with Garlic Curd Drizzle", "bowl", "Fusion", 20, "high", "easy", "high", "chana", ["high_protein", "quick", "bowl", "spicy"], [ing("chana", 0.75, "cup", "lentil", "monthly_staple"), ing("curd", 120, "g", "fresh dairy", "daily_use", fresh), ing("cucumber", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("coriander", 1, "bunch", "herbs", "same_day_fresh", fresh)]],
  ["aglio-paneer-bites", "Aglio e Olio with Chilli Paneer Bites", "dinner", "Continental", 25, "high", "easy", "high", "paneer", ["high_protein", "quick", "comfort", "dinner"], [ing("pasta", 90, "g", "grain", "monthly_staple"), ing("paneer", 160, "g", "fresh dairy", "same_day_fresh", fresh), ing("garlic", 4, "cloves", "vegetable", "weekly_fresh", fresh), ing("olive oil", 1, "tbsp", "oil", "monthly_staple")]],
  ["lemon-coriander-dal-soup", "Lemon coriander dal soup", "soup", "Indian", 25, "high", "easy", "high", "toor dal", ["soup", "light", "high_protein"], [ing("toor dal", 0.75, "cup", "lentil", "monthly_staple"), ing("coriander", 1, "bunch", "herbs", "same_day_fresh", fresh), ing("lemon", 2, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["sattu-curd-bowl", "Sattu curd bowl", "bowl", "Indian", 10, "high", "easy", "medium", "sattu", ["quick", "high_protein", "low_effort", "lunch"], [ing("sattu", 0.5, "cup", "flour", "monthly_staple"), ing("curd", 200, "g", "fresh dairy", "daily_use", fresh), ing("cucumber", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("roasted cumin", 1, "tsp", "spice", "monthly_staple")]],
  ["rajma-taco-bowl", "Rajma Burrito Bowl with Cucumber Salsa", "bowl", "Mexican", 30, "high", "easy", "medium", "rajma", ["bowl", "spicy", "filling", "dinner"], [ing("rajma", 0.75, "cup", "lentil", "monthly_staple"), ing("tortilla chips", 0.5, "cup", "snack", "recipe_based"), ing("curd", 100, "g", "fresh dairy", "daily_use", fresh), ing("tomatoes", 1, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["dahi-kebab-wrap", "Herby Dahi Kebab Wrap with Mint Curd", "dinner", "Fusion", 35, "high", "medium", "high", "hung curd", ["high_protein", "dinner", "comfort"], [ing("hung curd", 180, "g", "fresh dairy", "weekly_fresh", fresh), ing("besan", 0.2, "cup", "flour", "monthly_staple"), ing("wraps", 2, "pc", "bakery", "weekly_fresh", fresh), ing("mint", 1, "bunch", "herbs", "same_day_fresh", fresh)]],
  ["curd-rice-peanuts", "Curd rice bowl with roasted peanuts", "lunch", "Indian", 15, "medium", "easy", "medium", "curd", ["comfort", "quick", "low_effort"], [ing("curd", 250, "g", "fresh dairy", "daily_use", fresh), ing("rice", 1, "cup", "grain", "monthly_staple"), ing("peanuts", 0.25, "cup", "nuts", "monthly_staple"), ing("curry leaves", 1, "sprig", "herbs", "same_day_fresh", fresh)]],
  ["paneer-pesto-sandwich", "Pesto Paneer Sandwich with Tomato Soup", "dinner", "Continental", 18, "high", "easy", "high", "paneer", ["quick", "high_protein", "dinner"], [ing("paneer", 160, "g", "fresh dairy", "same_day_fresh", fresh), ing("bread", 2, "slices", "bakery", "weekly_fresh", fresh), ing("basil pesto", 2, "tbsp", "condiment", "recipe_based"), ing("tomatoes", 2, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["besan-pancake-curd", "Besan veggie pancake with curd dip", "dinner", "Indian", 20, "high", "easy", "medium", "besan", ["quick", "high_protein", "low_effort"], [ing("besan", 1, "cup", "flour", "monthly_staple"), ing("curd", 150, "g", "fresh dairy", "daily_use", fresh), ing("onions", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("capsicum", 1, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["spicy-tomato-dal-soup", "Spicy tomato dal soup", "soup", "Indian", 30, "high", "easy", "medium", "masoor dal", ["soup", "spicy", "light"], [ing("masoor dal", 0.75, "cup", "lentil", "monthly_staple"), ing("tomatoes", 4, "pc", "vegetable", "weekly_fresh", fresh), ing("green chillies", 3, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["paneer-cucumber-bowl", "Paneer cucumber bowl", "bowl", "Fusion", 15, "very_high", "easy", "high", "paneer", ["quick", "high_protein", "light"], [ing("paneer", 200, "g", "fresh dairy", "same_day_fresh", fresh), ing("cucumber", 2, "pc", "vegetable", "weekly_fresh", fresh), ing("curd", 100, "g", "fresh dairy", "daily_use", fresh), ing("pumpkin seeds", 2, "tbsp", "seeds", "monthly_staple")]],
  ["chickpea-yogurt-salad", "Chickpea cucumber yogurt salad", "salad", "Fusion", 15, "high", "easy", "medium", "chana", ["salad", "quick", "high_protein"], [ing("chana", 1, "cup", "lentil", "monthly_staple"), ing("curd", 160, "g", "fresh dairy", "daily_use", fresh), ing("cucumber", 2, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["lentil-garlic-toast", "Lentil soup with garlic toast", "soup", "Continental", 35, "high", "easy", "medium", "lentils", ["soup", "comfort", "dinner"], [ing("mixed lentils", 1, "cup", "lentil", "monthly_staple"), ing("bread", 4, "slices", "bakery", "weekly_fresh", fresh), ing("garlic", 6, "cloves", "vegetable", "weekly_fresh", fresh)]],
  ["pulao-paneer-side", "Pulao with paneer side", "lunch", "Indian", 30, "high", "easy", "high", "paneer", ["comfort", "filling"], [ing("rice", 1, "cup", "grain", "monthly_staple"), ing("mixed vegetables", 2, "cups", "vegetable", "weekly_fresh", fresh), ing("paneer", 160, "g", "fresh dairy", "same_day_fresh", fresh)]],
  ["moong-masoor-khichdi", "Moong-masoor comfort khichdi", "lunch", "Indian", 28, "high", "easy", "low", "moong and masoor dal", ["comfort", "low_effort"], [ing("moong dal", 0.5, "cup", "lentil", "monthly_staple"), ing("masoor dal", 0.5, "cup", "lentil", "monthly_staple"), ing("rice", 0.75, "cup", "grain", "monthly_staple")]],
  ["veggie-dalia-bowl", "Veggie dalia bowl", "bowl", "Indian", 25, "medium", "easy", "medium", "dalia", ["bowl", "light", "lunch"], [ing("dalia", 1, "cup", "grain", "monthly_staple"), ing("peas", 0.5, "cup", "vegetable", "weekly_fresh", fresh), ing("carrot", 2, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["hung-curd-sandwich", "High-protein hung curd sandwich", "dinner", "Continental", 15, "high", "easy", "high", "hung curd", ["quick", "high_protein", "low_effort"], [ing("hung curd", 220, "g", "fresh dairy", "weekly_fresh", fresh), ing("bread", 6, "slices", "bakery", "weekly_fresh", fresh), ing("cucumber", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("lettuce", 1, "cup", "vegetable", "same_day_fresh", fresh)]],
  ["chana-lettuce-cups", "Chana lettuce cups", "snack", "Fusion", 18, "high", "easy", "high", "chana", ["quick", "light", "high_protein"], [ing("chana", 1, "cup", "lentil", "monthly_staple"), ing("lettuce", 1, "head", "vegetable", "same_day_fresh", fresh), ing("mint", 1, "bunch", "herbs", "same_day_fresh", fresh)]],
  ["rajma-soup-bowl", "Rajma soup bowl", "soup", "Indian", 35, "high", "easy", "medium", "rajma", ["soup", "filling", "comfort"], [ing("rajma", 1, "cup", "lentil", "monthly_staple"), ing("tomatoes", 3, "pc", "vegetable", "weekly_fresh", fresh), ing("garlic", 4, "cloves", "vegetable", "weekly_fresh", fresh)]],
  ["paneer-corn-salad", "Paneer corn salad", "salad", "Fusion", 18, "high", "easy", "high", "paneer", ["salad", "quick", "high_protein"], [ing("paneer", 180, "g", "fresh dairy", "same_day_fresh", fresh), ing("corn", 1, "cup", "vegetable", "weekly_fresh", fresh), ing("coriander", 1, "bunch", "herbs", "same_day_fresh", fresh)]],
  ["carrot-ginger-roasted-chana", "Carrot ginger soup with roasted chana", "soup", "Fusion", 30, "medium", "easy", "medium", "roasted chana", ["soup", "light"], [ing("carrot", 4, "pc", "vegetable", "weekly_fresh", fresh), ing("ginger", 1, "inch", "vegetable", "weekly_fresh", fresh), ing("roasted chana", 0.5, "cup", "snack", "monthly_staple")]],
  ["cucumber-curd-rice", "Cucumber curd rice bowl", "lunch", "Indian", 15, "medium", "easy", "medium", "curd", ["comfort", "quick"], [ing("curd", 250, "g", "fresh dairy", "daily_use", fresh), ing("rice", 1, "cup", "grain", "monthly_staple"), ing("cucumber", 1, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["palak-paneer-soup", "Palak paneer soup bowl", "soup", "Indian", 28, "very_high", "easy", "high", "paneer", ["high_protein", "soup", "dinner"], [ing("spinach", 3, "cups", "greens", "same_day_fresh", fresh), ing("paneer", 180, "g", "fresh dairy", "same_day_fresh", fresh), ing("milk", 0.5, "cup", "fresh dairy", "daily_use", fresh)]],
  ["peanut-sesame-noodles-paneer", "Peanut sesame noodles with paneer", "dinner", "Asian", 25, "high", "easy", "high", "paneer", ["high_protein", "comfort", "spicy"], [ing("noodles", 180, "g", "grain", "monthly_staple"), ing("paneer", 170, "g", "fresh dairy", "same_day_fresh", fresh), ing("peanuts", 0.25, "cup", "nuts", "monthly_staple"), ing("sesame seeds", 2, "tbsp", "seeds", "monthly_staple")]],
  ["rajma-quinoa-salad", "Rajma quinoa salad", "salad", "Fusion", 30, "high", "easy", "medium", "rajma", ["salad", "bowl", "high_protein"], [ing("rajma", 1, "cup", "lentil", "monthly_staple"), ing("quinoa", 0.75, "cup", "grain", "monthly_staple"), ing("cucumber", 1, "pc", "vegetable", "weekly_fresh", fresh), ing("lemon", 1, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["dal-dhokli-lite", "High-protein dal dhokli lite", "dinner", "Indian", 40, "high", "medium", "low", "toor dal", ["comfort", "filling", "dinner"], [ing("toor dal", 1, "cup", "lentil", "monthly_staple"), ing("atta", 0.75, "cup", "flour", "monthly_staple"), ing("peanuts", 0.2, "cup", "nuts", "monthly_staple")]],
  ["paneer-labhra-bowl", "Paneer labhra bowl", "dinner", "Indian", 32, "very_high", "medium", "high", "paneer", ["high_protein", "comfort", "dinner"], [ing("paneer", 200, "g", "fresh dairy", "same_day_fresh", fresh), ing("mixed vegetables", 2, "cups", "vegetable", "weekly_fresh", fresh), ing("curd", 100, "g", "fresh dairy", "daily_use", fresh)]],
  ["sprouted-moong-bowl", "Sprouted moong bowl with curd drizzle", "bowl", "Indian", 15, "high", "easy", "high", "sprouted moong", ["quick", "light", "high_protein"], [ing("sprouted moong", 1.5, "cups", "fresh protein", "same_day_fresh", fresh), ing("curd", 120, "g", "fresh dairy", "daily_use", fresh), ing("cucumber", 1, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["cheesy-besan-toast", "Cheesy besan toast", "snack", "Fusion", 18, "high", "easy", "medium", "besan", ["quick", "comfort"], [ing("besan", 0.75, "cup", "flour", "monthly_staple"), ing("cheese", 60, "g", "fresh dairy", "weekly_fresh", fresh), ing("bread", 4, "slices", "bakery", "weekly_fresh", fresh)]],
  ["chole-palak-bowl", "Chole palak bowl", "dinner", "Indian", 35, "high", "easy", "high", "chana", ["high_protein", "filling", "dinner"], [ing("chana", 1, "cup", "lentil", "monthly_staple"), ing("spinach", 3, "cups", "greens", "same_day_fresh", fresh), ing("tomatoes", 3, "pc", "vegetable", "weekly_fresh", fresh)]],
  ["methi-paneer-bowl", "Methi paneer bowl", "dinner", "Indian", 25, "very_high", "easy", "high", "paneer", ["high_protein", "dinner", "comfort"], [ing("paneer", 200, "g", "fresh dairy", "same_day_fresh", fresh), ing("methi", 1, "bunch", "greens", "same_day_fresh", fresh), ing("curd", 100, "g", "fresh dairy", "daily_use", fresh)]],
  ["oats-dal-chilla", "Oats dal chilla with curd dip", "dinner", "Indian", 25, "high", "easy", "medium", "moong dal", ["high_protein", "quick"], [ing("moong dal", 0.75, "cup", "lentil", "monthly_staple"), ing("oats", 0.5, "cup", "grain", "monthly_staple"), ing("curd", 150, "g", "fresh dairy", "daily_use", fresh)]],
  ["seeded-curd-bowl", "Seeded curd protein bowl", "bowl", "Fusion", 10, "high", "easy", "medium", "curd", ["quick", "light", "high_protein"], [ing("curd", 250, "g", "fresh dairy", "daily_use", fresh), ing("pumpkin seeds", 2, "tbsp", "seeds", "monthly_staple"), ing("peanuts", 2, "tbsp", "nuts", "monthly_staple"), ing("fruit", 2, "servings", "fruit", "weekly_fresh", fresh)]]
];

export const seedRecipes: Recipe[] = recipeRows.map(([id, name, mealType, cuisine, prepTime, proteinLevel, difficulty, freshnessRequirement, mainProtein, tags, ingredients]) => ({
  id,
  name,
  mealType,
  cuisine,
  prepTime,
  proteinLevel,
  difficulty,
  freshnessRequirement,
  mainProtein,
  tags,
  ingredients,
  instructions: baseInstructions
})) as Recipe[];

export const selectedRecipeIds = [
  "paneer-tikka-salad-bowl",
  "mexican-rajma-bowl",
  "dal-palak-soup",
  "aglio-paneer-bites",
  "chana-chaat-curd",
  "methi-paneer-bowl",
  "cucumber-curd-rice"
];

export const samplePantry: PantryItem[] = [
  { id: "rice", name: "rice", category: "grain", quantity: 1.2, unit: "kg", buyingMode: "monthly_staple", purchaseDate: "2026-06-01", expiryDate: "2026-12-01", shelfLifeDays: 180, storageType: "pantry", stockStatus: "in_stock", dailyUsageQuantity: 80, dailyUsageUnit: "g", reorderThresholdQuantity: 500, reorderThresholdUnit: "g", freshnessPriority: "low", avoidStocking: false },
  { id: "curd", name: "curd", category: "fresh dairy", quantity: 250, unit: "g", buyingMode: "daily_use", purchaseDate: "2026-06-25", expiryDate: "2026-06-29", shelfLifeDays: 4, storageType: "fridge", stockStatus: "low_stock", dailyUsageQuantity: 100, dailyUsageUnit: "g", reorderThresholdQuantity: 300, reorderThresholdUnit: "g", freshnessPriority: "high", avoidStocking: false },
  { id: "paneer", name: "paneer", category: "fresh dairy", quantity: 0, unit: "g", buyingMode: "same_day_fresh", shelfLifeDays: 2, storageType: "fridge", stockStatus: "out_of_stock", reorderThresholdQuantity: 0, reorderThresholdUnit: "g", freshnessPriority: "high", avoidStocking: true, notes: "Order close to cooking." },
  { id: "moong-dal", name: "moong dal", category: "lentil", quantity: 300, unit: "g", buyingMode: "monthly_staple", purchaseDate: "2026-05-20", expiryDate: "2026-12-20", shelfLifeDays: 180, storageType: "pantry", stockStatus: "low_stock", reorderThresholdQuantity: 500, reorderThresholdUnit: "g", freshnessPriority: "low", avoidStocking: false },
  { id: "detergent", name: "detergent", category: "utility", quantity: 1, unit: "pack", buyingMode: "quarterly_bulk", purchaseDate: "2026-04-01", expiryDate: "2027-04-01", shelfLifeDays: 365, storageType: "utility", stockStatus: "in_stock", freshnessPriority: "non_food", avoidStocking: false }
];

export const weeklyEssentials = [
  ing("fruits", 7, "servings", "fruit", "weekly_fresh", fresh),
  ing("tomatoes", 8, "pc", "vegetable", "weekly_fresh", fresh),
  ing("onions", 6, "pc", "vegetable", "weekly_fresh", fresh),
  ing("cucumber", 4, "pc", "vegetable", "weekly_fresh", fresh),
  ing("lemons", 5, "pc", "vegetable", "weekly_fresh", fresh),
  ing("green chillies", 8, "pc", "vegetable", "weekly_fresh", fresh),
  ing("ginger", 100, "g", "vegetable", "weekly_fresh", fresh),
  ing("garlic", 2, "bulbs", "vegetable", "weekly_fresh", fresh),
  ing("curd", 1, "kg", "fresh dairy", "daily_use", fresh),
  ing("oat milk", 1, "L", "fresh dairy", "weekly_fresh", fresh),
  { ...ing("matcha powder", 1, "tin", "pantry", "one_time", "Breakfast default. Treat as already available unless marked finished."), optional: true },
  ing("bread or wraps", 1, "pack", "bakery", "weekly_fresh", fresh),
  ing("healthy snack", 1, "pack", "snack", "weekly_fresh", fresh)
];
