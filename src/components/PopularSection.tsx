import type { Verb } from "../types";

interface PopularSectionProps {
  verbs: Verb[];
  focusBase: string | null;
  onSelect: (base: string) => void;
}

export default function PopularSection({ verbs, focusBase, onSelect }: PopularSectionProps) {
  return (
    <section className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900 p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-indigo-400">🔥</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Más Usados / Populares</h2>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {verbs.map((v) => {
          const active = focusBase === v.base;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(active ? "" : v.base)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                active
                  ? "border-indigo-400 bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "border-indigo-500/10 bg-slate-800/60 text-indigo-200 hover:border-indigo-500/40 hover:bg-slate-800"
              }`}
            >
              {v.base.charAt(0).toUpperCase() + v.base.slice(1)}{" "}
              <span className="font-normal text-indigo-300/80">({v.es})</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
