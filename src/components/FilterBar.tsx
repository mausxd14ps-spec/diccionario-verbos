import type { VerbType } from "../types";

export type FilterValue = "all" | VerbType;

interface FilterBarProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  totalLabel: string;
}

const OPTIONS: { key: FilterValue; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "regular", label: "Regulares" },
  { key: "irregular", label: "Irregulares" },
];

export default function FilterBar({ value, onChange, totalLabel }: FilterBarProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:flex-row">
      <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              value === opt.key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="text-xs font-medium text-slate-400">{totalLabel}</div>
    </div>
  );
}
