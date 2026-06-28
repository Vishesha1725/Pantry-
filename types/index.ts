export type BuyingMode =
  | "same_day_fresh"
  | "daily_use"
  | "weekly_fresh"
  | "monthly_staple"
  | "quarterly_bulk"
  | "pantry_check"
  | "recipe_based"
  | "one_time";

export type MealType = "breakfast" | "dinner" | "lunch" | "snack" | "soup" | "salad" | "bowl";
export type Cuisine = "Indian" | "Asian" | "Mexican" | "Continental" | "Fusion";
export type StorageType = "fridge" | "freezer" | "pantry" | "utility";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type FreshnessPriority = "high" | "medium" | "low" | "non_food";

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  buyingMode: BuyingMode;
  usedInRecipeId?: string;
  usedInRecipeName?: string;
  defaultStatus?: GroceryStatus;
  notes?: string;
  optional?: boolean;
  freshnessRule?: string;
};

export type Recipe = {
  id: string;
  name: string;
  mealType: MealType;
  cuisine: Cuisine;
  prepTime: number;
  proteinLevel: "medium" | "high" | "very_high";
  difficulty: "easy" | "medium";
  freshnessRequirement: "low" | "medium" | "high";
  mainProtein: string;
  proteinSource?: string;
  shortDescription?: string;
  freshnessNotes?: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
};

export type PantryItem = {
  id: string;
  userId?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  buyingMode: BuyingMode;
  purchaseDate?: string;
  expiryDate?: string;
  shelfLifeDays: number;
  storageType: StorageType;
  stockStatus: StockStatus;
  dailyUsageQuantity?: number;
  dailyUsageUnit?: string;
  reorderThresholdQuantity?: number;
  reorderThresholdUnit?: string;
  freshnessPriority: FreshnessPriority;
  avoidStocking: boolean;
  notes?: string;
};

export type PlannedRecipe = {
  day: string;
  slot: "lunch" | "dinner";
  recipe: Recipe;
};

export type GroceryItem = Ingredient & {
  usedIn: string[];
  availableQuantity?: number;
  suggestedAction: string;
  status: "need" | "have" | "low" | "stale" | "optional" | "ignored";
  cookingDates?: string[];
};

export type GroceryStatus =
  | "need_to_order"
  | "have_at_home"
  | "order_fresh_on_day"
  | "check_pantry"
  | "monthly_staple"
  | "skip";

export type RecipeWiseGroceryItem = Ingredient & {
  usedInRecipeId: string;
  usedInRecipeName: string;
  status: GroceryStatus;
  mealDay: string;
};

export type RecipeWiseGroceryGroup = {
  recipeId: string;
  recipeName: string;
  mealDay: string;
  ingredients: RecipeWiseGroceryItem[];
};

export type CombinedGroceryItem = {
  id: string;
  ingredientName: string;
  totalQuantity: number;
  unit: string;
  category: string;
  buyingMode: BuyingMode;
  usedInRecipes: string[];
  status: GroceryStatus;
  mealDay?: string;
  notes?: string;
};

export type GrocerySections = {
  todayFresh: GroceryItem[];
  sameDayByDate: Record<string, GroceryItem[]>;
  weeklyFresh: GroceryItem[];
  monthlyStaples: GroceryItem[];
  quarterlyBulk: GroceryItem[];
  checkPantry: GroceryItem[];
  optional: GroceryItem[];
  ignored: GroceryItem[];
};

export type GrocerySectionKey = Exclude<keyof GrocerySections, "sameDayByDate"> | `sameDayByDate:${string}`;
