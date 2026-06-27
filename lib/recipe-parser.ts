import type { Ingredient, PlannedRecipe, Recipe } from "@/types";
import { decideBuyingMode } from "./freshness-engine";

const ingredientHints = [
  "paneer", "curd", "hung curd", "dal", "moong dal", "masoor dal", "rajma", "chana", "besan", "sattu",
  "rice", "atta", "pasta", "oats", "tomatoes", "onions", "cucumber", "spinach", "coriander", "mint",
  "lemon", "ginger", "garlic", "milk", "cheese", "peanuts", "seeds", "lettuce", "bread", "wraps"
];

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function parseQuantity(line: string) {
  const match = line.match(/(\d+(?:\.\d+)?|\d+\/\d+)\s*(kg|g|cup|cups|tbsp|tsp|pc|pcs|L|ml|bunch|pack|slices)?/i);
  if (!match) return { quantity: 1, unit: "portion" };
  const raw = match[1].includes("/") ? match[1].split("/").map(Number).reduce((a, b) => a / b) : Number(match[1]);
  return { quantity: raw, unit: match[2] ?? "portion" };
}

function ingredientFromLine(line: string): Ingredient | null {
  const lower = line.toLowerCase();
  const hit = ingredientHints.find((hint) => lower.includes(hint));
  if (!hit) return null;
  const { quantity, unit } = parseQuantity(line);
  const category = /paneer|curd|milk|cheese/.test(hit) ? "fresh dairy" : /dal|rajma|chana/.test(hit) ? "lentil" : /rice|pasta|oats|atta|besan|sattu/.test(hit) ? "pantry" : "vegetable";
  return {
    id: hit.replaceAll(" ", "-"),
    name: hit,
    quantity,
    unit,
    category,
    buyingMode: decideBuyingMode({ name: hit, category, buyingMode: "recipe_based" }),
    freshnessRule: "Detected from pasted recipe. Review quantity before saving."
  };
}

export function parseRecipesFromText(text: string): PlannedRecipe[] {
  const chunks = text
    .split(/\n(?=(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d+\.|-|\*)\s*)/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const parsed = chunks.length ? chunks : [text.trim()].filter(Boolean);
  return parsed.map((chunk, index) => {
    const explicitDay = dayNames.find((day) => new RegExp(day, "i").test(chunk));
    const firstLine = chunk.split("\n")[0].replace(/^[-*\d.\s:]+/, "").replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*[:-]?\s*/i, "");
    const name = firstLine.length > 3 ? firstLine : "Cozy custom recipe";
    const ingredients = chunk
      .split(/\n|,/)
      .map(ingredientFromLine)
      .filter((item): item is Ingredient => Boolean(item));
    const fallback = ingredientFromLine(name);
    const recipe: Recipe = {
      id: `custom-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      mealType: "dinner",
      cuisine: "Fusion",
      prepTime: 25,
      proteinLevel: /paneer|rajma|chana|dal|curd|besan|sattu/i.test(chunk) ? "high" : "medium",
      difficulty: "easy",
      freshnessRequirement: /paneer|coriander|mint|lettuce|spinach/i.test(chunk) ? "high" : "medium",
      mainProtein: ingredients[0]?.name ?? fallback?.name ?? "vegetarian protein",
      tags: ["dinner", "high_protein", "custom"],
      ingredients: ingredients.length ? ingredients : fallback ? [fallback] : [],
      instructions: ["Review parsed ingredients.", "Cook using the pasted recipe method.", "Adjust quantities before generating groceries."]
    };
    return { day: explicitDay ?? dayNames[index % dayNames.length], slot: "dinner", recipe };
  });
}
