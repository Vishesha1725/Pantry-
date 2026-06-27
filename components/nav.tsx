import Link from "next/link";
import { CalendarDays, ClipboardList, Home, PackageCheck, ShoppingBasket, Store } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/recipes", label: "Recipes", icon: ShoppingBasket },
  { href: "/meal-plan", label: "Plan", icon: CalendarDays },
  { href: "/inbox", label: "Inbox", icon: ClipboardList },
  { href: "/grocery", label: "Grocery", icon: Store },
  { href: "/pantry", label: "Pantry", icon: PackageCheck }
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="mr-auto flex items-center gap-2 text-lg font-black text-cocoa">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sage text-white shadow-cozy">PQ</span>
          Pantry Quest
        </Link>
        <div className="hidden gap-1 md:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-cocoa/80 hover:bg-white/70 hover:text-cocoa">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
