import { useState } from "react";
import { FORM_ORDER, type Verb } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { playTone } from "../utils/sfx";
import SpeakButton from "./SpeakButton";

type Game = "formas" | "frase" | "significado";
type Source = "lista" | "todos" | "regular" | "irregular";

interface Question {
  title: string;
  subtitle?: string;
  ask: string;
  big: boolean;
  options: string[];
  correct: string;
  speakTitle?: string;
  speakAfter: string;
}

interface QuizProps {
  open: boolean;
  onClose: () => void;
  allVerbs: Verb[];
  listVerbs: Verb[];
}

const QUESTIONS_PER_ROUND = 10;

const GAMES: { id: Game; emoji: string; name: string; desc: string }[] = [
  {
    id: "formas",
    emoji: "⚡",
    name: "Pasado vs participio",
    desc: "Solo verbos irregulares. Elige el Past Simple o el Past Participle correcto (went / gone).",
  },
  {
    id: "frase",
    emoji: "✍️",
    name: "Completa la frase",
    desc: "Elige la forma correcta del verbo en una oración real: base, -s, -ing, pasado o participio.",
  },
  {
    id: "significado",
    emoji: "🇪🇸",
    name: "¿Qué significa?",
    desc: "Ves el verbo en inglés y eliges su traducción al español.",
  },
];

const SOURCES: { id: Source; label: string }[] = [
  { id: "lista", label: "🛒 Mi lista" },
  { id: "todos", label: "📚 Todos" },
  { id: "regular", label: "🌱 Solo regulares" },
  { id: "irregular", label: "⚡ Solo irregulares" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function regularForm(base: string) {
  return base.endsWith("e") ? base + "d" : base + "ed";
}

function qFormas(verb: Verb, all: Verb[]): Question {
  const key = Math.random() < 0.5 ? "past" : "participle";
  const correct = verb.forms[key];
  const wrong = new Set<string>();
  const fake = regularForm(verb.base);
  if (fake !== correct) wrong.add(fake);
  for (const v of shuffle(all)) {
    if (wrong.size >= 3) break;
    const f = v.forms[key];
    if (f !== correct) wrong.add(f);
  }
  return {
    title: verb.base,
    subtitle: verb.es,
    ask: key === "past" ? "¿Cuál es el pasado simple (Past Simple)?" : "¿Cuál es el participio (Past Participle)?",
    big: true,
    options: shuffle([correct, ...wrong]),
    correct,
    speakTitle: verb.base,
    speakAfter: correct,
  };
}

function qFrase(verb: Verb): Question | null {
  for (const key of shuffle(FORM_ORDER)) {
    const form = verb.forms[key];
    if (form.includes("/")) continue;
    const sentence = verb.examples[key].en;
    const m = new RegExp(`\\b${escapeRe(form)}\\b`, "i").exec(sentence);
    if (!m) continue;
    const upper = m.index === 0;
    const fix = (s: string) => (upper ? cap(s) : s);
    const forms = [...new Set(FORM_ORDER.map((k) => verb.forms[k]).filter((f) => !f.includes("/")))];
    const wrong = shuffle(forms.filter((f) => f !== form)).slice(0, 3);
    if (wrong.length < 2) continue;
    const correct = fix(form);
    return {
      title: sentence.slice(0, m.index) + "_____" + sentence.slice(m.index + m[0].length),
      subtitle: verb.examples[key].es,
      ask: `Completa con la forma correcta de «${verb.base}»`,
      big: false,
      options: shuffle([correct, ...wrong.map(fix)]),
      correct,
      speakAfter: sentence,
    };
  }
  return null;
}

function qSignificado(verb: Verb, all: Verb[]): Question {
  const wrong = new Set<string>();
  for (const v of shuffle(all)) {
    if (wrong.size >= 3) break;
    if (v.es !== verb.es) wrong.add(v.es);
  }
  return {
    title: verb.base,
    ask: "¿Qué significa en español?",
    big: true,
    options: shuffle([verb.es, ...wrong]),
    correct: verb.es,
    speakTitle: verb.base,
    speakAfter: verb.base,
  };
}

function buildQuestions(game: Game, pool: Verb[], all: Verb[]): Question[] {
  const result: Question[] = [];
  for (const verb of shuffle(pool)) {
    if (result.length >= QUESTIONS_PER_ROUND) break;
    if (game === "formas") result.push(qFormas(verb, all));
    else if (game === "significado") result.push(qSignificado(verb, all));
    else {
      const q = qFrase(verb);
      if (q) result.push(q);
    }
  }
  return result;
}

export default function Quiz({ open, onClose, allVerbs, listVerbs }: QuizProps) {
  const [stage, setStage] = useState<"menu" | "playing" | "done">("menu");
  const [game, setGame] = useState<Game | null>(null);
  const [source, setSource] = useState<Source>("todos");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useLocalStorage<Record<string, number>>("evp-quiz-best-v2", {});
  const [soundOn, setSoundOn] = useLocalStorage<boolean>("evp-quiz-sound", true);

  if (!open) return null;

  const regulars = allVerbs.filter((v) => v.type === "regular");
  const irregulars = allVerbs.filter((v) => v.type === "irregular");

  const poolFor = (g: Game, src: Source): Verb[] => {
    const base =
      src === "lista" ? listVerbs : src === "regular" ? regulars : src === "irregular" ? irregulars : allVerbs;
    if (g === "formas") return base.filter((v) => v.type === "irregular");
    if (g === "frase") return base.filter((v) => v.detailed);
    return base;
  };

  const start = (g: Game, src: Source) => {
    const qs = buildQuestions(g, poolFor(g, src), allVerbs);
    if (qs.length === 0) return;
    setGame(g);
    setSource(src);
    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStage("playing");
  };

  const handleClose = () => {
    setStage("menu");
    setGame(null);
    onClose();
  };

  const answer = (option: string) => {
    if (selected !== null) return;
    const ok = option === questions[index].correct;
    setSelected(option);
    if (ok) setScore((s) => s + 1);
    if (soundOn) playTone(ok);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      const pct = Math.round((score / questions.length) * 100);
      if (game) setBest((prev) => ({ ...prev, [game]: Math.max(prev[game] ?? 0, pct) }));
      setStage("done");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const q = questions[index];
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const currentGame = GAMES.find((g) => g.id === game);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Cerrar quiz" onClick={handleClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-800 bg-slate-900 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div>
            <h2 className="text-lg font-bold text-white">🎯 Quiz de verbos</h2>
            {game && <p className="text-xs text-slate-400">Mejor resultado ({currentGame?.name}): {best[game] ?? 0}%</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundOn((v) => !v)}
              title={soundOn ? "Silenciar efectos" : "Activar efectos"}
              aria-label={soundOn ? "Silenciar efectos" : "Activar efectos"}
              className="rounded-full bg-slate-800 px-2.5 py-2 text-sm transition hover:bg-slate-700"
            >
              {soundOn ? "🔔" : "🔕"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar"
              className="rounded-full bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {stage === "menu" && !game && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-300">Elige un juego:</p>
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGame(g.id)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left transition hover:border-indigo-400"
                >
                  <span className="block text-sm font-bold text-white">
                    {g.emoji} {g.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-400">{g.desc}</span>
                </button>
              ))}
            </div>
          )}

          {stage === "menu" && game && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setGame(null)}
                className="self-start text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                ← Cambiar de juego
              </button>
              <div>
                <p className="text-sm font-bold text-white">
                  {currentGame?.emoji} {currentGame?.name}
                </p>
                <p className="text-xs text-slate-400">{currentGame?.desc}</p>
              </div>
              <p className="text-sm text-slate-300">¿Con qué verbos quieres practicar?</p>
              {SOURCES.map((s) => {
                const count = poolFor(game, s.id).length;
                const disabled = count === 0;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => start(game, s.id)}
                    disabled={disabled}
                    className="rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                  >
                    {s.label} ({count} verbos)
                    {disabled && s.id === "lista" && (
                      <span className="block text-xs font-normal">
                        Añade verbos con el botón + (en este juego cuentan solo los que sirven para él)
                      </span>
                    )}
                    {disabled && game === "formas" && s.id === "regular" && (
                      <span className="block text-xs font-normal">
                        Los regulares tienen igual el pasado y el participio (-ed), aquí no aplica
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {stage === "playing" && q && (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Pregunta {index + 1} de {questions.length}
                </span>
                <span>Aciertos: {score}</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${(index / questions.length) * 100}%` }}
                />
              </div>

              <div className="mb-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <p className={q.big ? "text-3xl font-extrabold text-white" : "text-xl font-bold text-white"}>
                    {q.title}
                  </p>
                  {q.speakTitle && <SpeakButton text={q.speakTitle} />}
                </div>
                {q.subtitle && <p className="mt-1 text-sm italic text-indigo-200">{q.subtitle}</p>}
                <p className="mt-4 text-sm text-slate-300">{q.ask}</p>
              </div>

              <div className="grid gap-2">
                {q.options.map((opt) => {
                  const isCorrect = opt === q.correct;
                  const isChosen = opt === selected;
                  let cls = "border-slate-700 bg-slate-800 text-white hover:border-indigo-400";
                  if (selected !== null) {
                    if (isCorrect) cls = "border-emerald-500 bg-emerald-500/20 text-emerald-200";
                    else if (isChosen) cls = "border-red-500 bg-red-500/20 text-red-200";
                    else cls = "border-slate-800 bg-slate-800/50 text-slate-500";
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => answer(opt)}
                      disabled={selected !== null}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-base font-semibold transition ${cls}`}
                    >
                      <span>{opt}</span>
                      {selected !== null && isCorrect && <span>✅</span>}
                      {selected !== null && isChosen && !isCorrect && <span>❌</span>}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <SpeakButton text={q.speakAfter} />
                    <span>{selected === q.correct ? "¡Correcto!" : "Mira la respuesta ✅"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500"
                  >
                    {index + 1 >= questions.length ? "Ver resultado" : "Siguiente →"}
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === "done" && game && (
            <div className="py-4 text-center">
              <p className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</p>
              <p className="mt-3 text-3xl font-extrabold text-white">
                {score} / {questions.length}
              </p>
              <p className="text-sm text-slate-400">{pct}% de aciertos</p>
              <p className="mt-2 text-sm text-slate-300">
                {pct >= 80
                  ? "¡Excelente!"
                  : pct >= 50
                    ? "Vas bien, sigue practicando."
                    : "Repasa los verbos e inténtalo otra vez."}
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => start(game, source)}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-500"
                >
                  Jugar otra vez
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStage("menu");
                    setGame(null);
                  }}
                  className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cambiar juego
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}