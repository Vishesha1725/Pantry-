import { NextResponse } from "next/server";
import { generateLocalRecipes } from "@/lib/recipe-generator";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ offset: 0 }));
  const offset = typeof body.offset === "number" ? body.offset : 0;

  if (!process.env.RECIPE_AI_API_KEY) {
    return NextResponse.json({
      source: "local_fallback",
      recipes: generateLocalRecipes(18, offset),
      message: "Using local recipe generator because RECIPE_AI_API_KEY is not configured."
    });
  }

  return NextResponse.json({
    source: "local_fallback",
    recipes: generateLocalRecipes(18, offset),
    message: "AI provider hook is configured server-side, but local fallback is used until provider integration is enabled."
  });
}
