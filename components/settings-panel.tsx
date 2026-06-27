"use client";

import { useState } from "react";

const defaults = ["Fruits", "Milk", "Curd", "Bread/wraps", "Healthy snack"];

export function SettingsPanel() {
  const [enabled, setEnabled] = useState(defaults);
  return (
    <div className="cozy-panel rounded-2xl p-5">
      <h2 className="text-xl font-black text-cocoa">Weekly essentials</h2>
      <div className="mt-4 grid gap-3">
        {defaults.map((item) => (
          <label key={item} className="flex items-center justify-between rounded-xl bg-white/65 p-3 font-semibold text-cocoa">
            {item}
            <input type="checkbox" checked={enabled.includes(item)} onChange={() => setEnabled((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} />
          </label>
        ))}
      </div>
    </div>
  );
}
