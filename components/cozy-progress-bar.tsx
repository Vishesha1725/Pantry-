export function CozyProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold text-cocoa">
        <span>{label ?? "Quest progress"}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/70 shadow-insetCozy">
        <div className="h-full rounded-full bg-gradient-to-r from-sage via-honey to-coral" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
