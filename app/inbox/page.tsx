import { Nav } from "@/components/nav";
import { RecipePasteBox } from "@/components/recipes/recipe-paste-box";

export default function InboxPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 cozy-panel rounded-2xl p-5">
          <h1 className="text-3xl font-black text-cocoa">Recipe Inbox</h1>
          <p className="mt-2 text-muted-foreground">Paste a recipe, rough meal idea, or 7-day plan. The local parser extracts recipes and editable grocery ingredients, with AI parsing ready to plug in later.</p>
        </div>
        <RecipePasteBox />
      </main>
    </>
  );
}
