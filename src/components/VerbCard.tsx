import { FORM_ORDER, FORM_LABELS, type FormKey, type Verb } from "../types";

interface VerbCardProps {
  verb: Verb;
  isOpen: boolean;
  onToggle: () => void;
  isInCart: boolean;
  onToggleCart: () => void;
}

const FORM_EXAMPLE_LABELS: Record<FormKey, string> = {
  base: "Base / Infinitive",
  past: "Past Simple",
  participle: "Past Participle",
  gerund: "Gerund (-ing)",
  third: "Third Person (-s)",
};

export default function VerbCard({ verb, isOpen, onToggle, isInCart, onToggleCart }: VerbCardProps) {
  const typeBadgeClass =
    verb.type === "regular"
      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
      : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-black/10 transition-all">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onToggleCart}
            title={isInCart ? "Quitar de mi lista" : "Añadir a mi lista"}
            aria-pressed={isInCart}
            className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
              isInCart
                ? "border-indigo-400 bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                : "border-slate-700 bg-slate-800 text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
            }`}
          >
            {isInCart ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-white">{cap(verb.base)}</h3>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeBadgeClass}`}>
                {verb.type === "regular" ? "Regular" : "Irregular"}
              </span>
            </div>
            <p className="text-base font-semibold text-indigo-200">{verb.es}</p>
            <p className="mt-0.5 text-sm text-slate-400">{verb.definition}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex shrink-0 items-center gap-2 self-start text-xs font-semibold text-indigo-400 hover:text-indigo-300 sm:self-center"
        >
          {isOpen ? "Toca para cerrar" : "Toca para abrir"}
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950/40 p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">Formas Gramaticales</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {FORM_ORDER.map((key) => (
              <div key={key} className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{FORM_LABELS[key]}</p>
                <p className="mt-1 text-sm font-bold text-white">{verb.forms[key]}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-400">
                📘 Definición
              </p>
              <p className="text-sm text-slate-300">{verb.definition}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-400">
                💡 ¿Cuándo se usa?
              </p>
              <p className="text-sm text-slate-300">{verb.usage}</p>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">
              {verb.detailed ? "Ejemplos de uso en todas sus formas" : "Ejemplo de uso"}
            </h4>
            <div className="space-y-3">
              {(verb.detailed ? FORM_ORDER : (["base"] as FormKey[])).map((key) => (
                <div
                  key={key}
                  className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <span className="mb-1 inline-block rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold text-indigo-300 ring-1 ring-indigo-500/30">
                      {verb.detailed ? FORM_EXAMPLE_LABELS[key] : "Ejemplo"}
                    </span>
                    <p className="font-medium text-white">{verb.examples[key].en}</p>
                  </div>
                  <p className="text-sm italic text-slate-400 sm:text-right">{verb.examples[key].es}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
