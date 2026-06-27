import type { LucideIcon } from "lucide-react";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({ title, description, icon: Icon = Sprout, className, action }: { title: string; description: string; icon?: LucideIcon; className?: string; action?: React.ReactNode }) {
  return (
    <div className={cn("grid place-items-center rounded-2xl border border-dashed bg-white/55 p-6 text-center", className)}>
      <div>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-honey/25 text-cocoa">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="mt-3 font-black text-cocoa">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
