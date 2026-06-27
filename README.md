# Pantry Quest

Pantry Quest is a cozy, gamified grocery and recipe planning web app for vegetarian weekly meal planning. It suggests healthy high-protein recipes, lets users paste outside recipes, generates freshness-aware grocery lists, checks pantry inventory, and separates what to buy today, weekly, monthly, quarterly, or only on a cooking day.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local primitives
- Supabase
- React Three Fiber and Drei
- Vercel-ready deployment

## Features

- Cozy dashboard with weekly recipes, grocery sections, pantry alerts, progress, and a 3D grocery store preview.
- Weekly recipe picker with 40 seeded vegetarian recipes and no soya, tofu, or mushrooms.
- Weekly meal calendar with editable cooking days.
- Rule-based recipe inbox parser for pasted recipes, rough meal ideas, and 7-day plans.
- Grocery generator that merges duplicate ingredients, compares pantry stock, checks freshness, and separates same-day fresh, weekly fresh, monthly staples, quarterly bulk, pantry checks, optional, and ignored items.
- Configurable weekly essentials.
- Pantry tracker fields for stock, expiry, shelf life, storage, daily usage, thresholds, freshness priority, and avoid-stocking rules.
- Lightweight interactive 3D grocery store zones for fresh, weekly, pantry, bulk, recipe basket, and cart review.
- Supabase SQL schema with RLS policies.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run typecheck
npm run build
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The app works with local seed data first. Supabase is optional until persistence is wired into mutations and auth.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Add the environment variables above to `.env.local`.
5. For production, add the same variables in Vercel Project Settings.

## Database Schema

The schema includes:

- `profiles`
- `pantry_items`
- `recipes`
- `recipe_ingredients`
- `weekly_recipe_plans`
- `weekly_plan_recipes`
- `grocery_lists`
- `grocery_list_items`
- `weekly_essentials`
- `user_achievements`

## GitHub Push

```bash
git add .
git commit -m "Build Pantry Quest app"
git branch -M main
git remote add origin https://github.com/<your-user>/pantry-quest.git
git push -u origin main
```

## Vercel Deployment

1. Push the repo to GitHub.
2. Import it in Vercel.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.

## Future AI Integration

The local parser lives in `lib/recipe-parser.ts`. It is rule-based by design and can later be replaced or augmented with an AI parser that returns the same typed structure:

- recipe names
- cooking days
- ingredients
- quantities
- units
- freshness rules
- buying mode hints

The grocery logic lives in `lib/grocery-generator.ts` and `lib/freshness-engine.ts`, so AI parsing can improve extraction without changing the buying and freshness rules.
