const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetNavProps {
  value: string;
  onChange: (letter: string) => void;
  availableLetters: Set<string>;
}

export default function AlphabetNav({ value, onChange, availableLetters }: AlphabetNavProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por letra"
      className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3"
    >
      <button
        type="button"
        onClick={() => onChange("ALL")}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          value === "ALL" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        TODOS
      </button>
      {LETTERS.map((letter) => {
        const disabled = !availableLetters.has(letter);
        return (
          <button
            key={letter}
            type="button"
            disabled={disabled}
            onClick={() => onChange(letter)}
            className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
              value === letter
                ? "bg-indigo-600 text-white"
                : disabled
                  ? "cursor-not-allowed bg-slate-900 text-slate-700"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
