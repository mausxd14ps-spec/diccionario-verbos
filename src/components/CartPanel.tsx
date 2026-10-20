import { useState } from "react";
import { FORM_ORDER, FORM_SHORT_LABELS, type FormKey, type Verb } from "../types";
import { exportCsv, exportPdf } from "../utils/exportList";

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
  verbs: Verb[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function CartPanel({ open, onClose, verbs, onRemove, onClear }: CartPanelProps) {
  const [selectedForms, setSelectedForms] = useState<Set<FormKey>>(new Set(FORM_ORDER));
  const [includeTranslation, setIncludeTranslation] = useState(true);
  const [includeDefinition, setIncludeDefinition] = useState(true);
  const [includeExample, setIncludeExample] = useState(true);

  if (!open) return null;

  const toggleForm = (key: FormKey) => {
    setSelectedForms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const options = {
    includeForms: FORM_ORDER.filter((f) => selectedForms.has(f)),
    includeTranslation,
    includeDefinition,
    includeExample,
  };

  const hasVerbs = verbs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Cerrar panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-800 bg-slate-900 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div>
            <h2 className="text-lg font-bold text-white">🛒 Mi lista de verbos</h2>
            <p className="text-xs text-slate-400">{verbs.length} verbo(s) añadido(s)</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {!hasVerbs ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
              <span className="text-3xl">📭</span>
              <p className="text-sm">
                Tu lista está vacía. Pulsa el botón <span className="font-semibold text-indigo-300">+</span> en cualquier
                verbo para añadirlo.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap gap-2">
                {verbs.map((v) => (
                  <span
                    key={v.id}
                    className="flex items-center gap-1.5 rounded-full bg-slate-800 py-1 pl-3 pr-1.5 text-xs font-semibold text-slate-200"
                  >
                    {cap(v.base)}
                    <button
                      type="button"
                      onClick={() => onRemove(v.id)}
                      aria-label={`Quitar ${v.base}`}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-slate-400 hover:bg-red-500/80 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Elige qué incluir en la descarga
                </p>
                <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {FORM_ORDER.map((key) => (
                    <label key={key} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedForms.has(key)}
                        onChange={() => toggleForm(key)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                      />
                      {FORM_SHORT_LABELS[key]}
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 border-t border-slate-800 pt-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeTranslation}
                      onChange={() => setIncludeTranslation((v) => !v)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                    />
                    Traducción
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeDefinition}
                      onChange={() => setIncludeDefinition((v) => !v)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                    />
                    Definición
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeExample}
                      onChange={() => setIncludeExample((v) => !v)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                    />
                    Ejemplo de uso
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {hasVerbs && (
          <div className="flex flex-col gap-2 border-t border-slate-800 p-5 sm:flex-row">
            <button
              type="button"
              onClick={() => exportCsv(verbs, options)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-500"
            >
              ⬇️ Descargar CSV
            </button>
            <button
              type="button"
              onClick={() => exportPdf(verbs, options)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500"
            >
              ⬇️ Descargar PDF
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-red-500/20 hover:text-red-300"
            >
              Vaciar lista
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
