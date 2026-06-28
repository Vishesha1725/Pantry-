import { MealPlanCalendar } from "@/components/meal-plan-calendar";
import { Nav } from "@/components/nav";

export default function PlanPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 cozy-panel rounded-2xl p-5">
          <h1 className="text-3xl font-black text-cocoa">Weekly Meal Plan</h1>
          <p className="mt-2 text-muted-foreground">Move recipes between days. Same-day fresh reminders follow the cooking day instead of bulk-buying paneer on Sunday.</p>
        </div>
        <MealPlanCalendar />
      </main>
    </>
  );
}
