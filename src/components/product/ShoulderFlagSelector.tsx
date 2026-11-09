"use client";

import { SHOULDER_FLAG_OPTIONS, ShoulderFlagOption, getShoulderFlagLabel } from "@/types/product";

interface ShoulderFlagSelectorProps {
  value: ShoulderFlagOption;
  onChange: (value: ShoulderFlagOption) => void;
  compact?: boolean;
}

export function ShoulderFlagSelector({ value, onChange, compact = false }: ShoulderFlagSelectorProps) {
  return (
    <div className={compact ? "mt-4 border-t border-border pt-4" : "mt-6 space-y-3 border-t border-border pt-6"}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">Indian flag on shoulder</span>
        <span className="text-[11px] font-semibold text-accent">{getShoulderFlagLabel(value)}</span>
      </div>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Choose Indian flag option">
        {SHOULDER_FLAG_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-border bg-surface text-muted hover:border-ink hover:text-ink"
              }`}
            >
              <span className="block text-xs font-semibold">{option.label}</span>
              {!compact && <span className={`mt-1 block text-[11px] ${selected ? "text-white/70" : "text-muted"}`}>{option.description}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
