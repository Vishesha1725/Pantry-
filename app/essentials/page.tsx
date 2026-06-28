import { SettingsPanel } from "@/components/settings-panel";
import { Nav } from "@/components/nav";

export default function EssentialsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <SettingsPanel />
        <section className="cozy-panel rounded-2xl p-5">
          <h1 className="text-3xl font-black text-cocoa">Default weekly essentials</h1>
          <p className="mt-3 text-muted-foreground">These are included when groceries are generated. Oat milk defaults to 1 litre per week, and matcha is treated as already available unless you remove or edit it.</p>
        </section>
      </main>
    </>
  );
}
