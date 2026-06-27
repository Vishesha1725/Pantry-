import { SettingsPanel } from "@/components/settings-panel";
import { Nav } from "@/components/nav";
import { weeklyEssentials } from "@/lib/seed-recipes";

export default function EssentialsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <SettingsPanel />
        <section className="cozy-panel rounded-2xl p-5">
          <h1 className="text-3xl font-black text-cocoa">Default weekly essentials</h1>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {weeklyEssentials.map((item) => <div key={item.name} className="rounded-xl bg-white/65 p-3 font-semibold text-cocoa">{item.name}: {item.quantity} {item.unit}</div>)}
          </div>
        </section>
      </main>
    </>
  );
}
