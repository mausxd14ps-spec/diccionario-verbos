import { useEffect, useMemo, useState } from "react";
import verbsData from "./data/verbs.json";
import type { Verb } from "./types";
import Header from "./components/Header";
import PopularSection from "./components/PopularSection";
import FilterBar, { type FilterValue } from "./components/FilterBar";
import AlphabetNav from "./components/AlphabetNav";
import VerbCard from "./components/VerbCard";
import Pagination from "./components/Pagination";
import CartPanel from "./components/CartPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";

const VERBS = verbsData as Verb[];
const PAGE_SIZE = 20;

export default function App() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterValue>("all");
  const [letter, setLetter] = useState("ALL");
  const [focusBase, setFocusBase] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [cart, setCart] = useLocalStorage<string[]>("evp-cart", []);
  const [cartOpen, setCartOpen] = useState(false);

  const popularVerbs = useMemo(() => VERBS.filter((v) => v.popular), []);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (focusBase) {
      const found = VERBS.find((v) => v.base === focusBase);
      return found ? [found] : [];
    }
    return VERBS.filter((v) => {
      if (filterType !== "all" && v.type !== filterType) return false;
      if (letter !== "ALL" && v.base.charAt(0).toUpperCase() !== letter) return false;
      if (normalizedQuery) {
        const matchesEn = v.base.toLowerCase().includes(normalizedQuery);
        const matchesEs = v.es.toLowerCase().includes(normalizedQuery);
        if (!matchesEn && !matchesEs) return false;
      }
      return true;
    });
  }, [filterType, letter, normalizedQuery, focusBase]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const v of VERBS) {
      if (filterType !== "all" && v.type !== filterType) continue;
      set.add(v.base.charAt(0).toUpperCase());
    }
    return set;
  }, [filterType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [filterType, letter, normalizedQuery, focusBase]);

  const cartVerbs = useMemo(() => {
    const set = new Set(cart);
    return VERBS.filter((v) => set.has(v.id));
  }, [cart]);

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCart = (id: string) => {
    setCart((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectPopular = (base: string) => {
    setFocusBase(base || null);
    if (base) {
      setOpenIds((prev) => new Set(prev).add(base));
      requestAnimationFrame(() => {
        document.getElementById("listado")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const handleFilterChange = (value: FilterValue) => {
    setFocusBase(null);
    setFilterType(value);
  };

  const handleLetterChange = (value: string) => {
    setFocusBase(null);
    setLetter(value);
  };

  const handleQueryChange = (value: string) => {
    setFocusBase(null);
    setQuery(value);
  };

  const totalLabel = focusBase
    ? "Mostrando 1 verbo seleccionado"
    : filterType === "all"
      ? "Mostrando todos los verbos"
      : filterType === "regular"
        ? "Mostrando solo verbos regulares"
        : "Mostrando solo verbos irregulares";

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <Header query={query} onQueryChange={handleQueryChange} />

      <main className="mx-auto flex w-full max-w-6xl flex-grow flex-col gap-8 px-4 py-8">
        <PopularSection verbs={popularVerbs} focusBase={focusBase} onSelect={handleSelectPopular} />

        <FilterBar value={filterType} onChange={handleFilterChange} totalLabel={totalLabel} />

        <AlphabetNav value={focusBase ? "" : letter} onChange={handleLetterChange} availableLetters={availableLetters} />

        <section id="listado" className="scroll-mt-28">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-200">Listado de Verbos</h3>
            <div className="flex items-center gap-2">
              {focusBase && (
                <button
                  type="button"
                  onClick={() => handleSelectPopular("")}
                  className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-300 hover:bg-slate-700"
                >
                  ← Ver todos
                </button>
              )}
              <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                {filtered.length} verbo{filtered.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {paginated.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              No se encontraron verbos con esos filtros. Intenta con otra búsqueda.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {paginated.map((verb) => (
                <VerbCard
                  key={verb.id}
                  verb={verb}
                  isOpen={openIds.has(verb.id)}
                  onToggle={() => toggleOpen(verb.id)}
                  isInCart={cart.includes(verb.id)}
                  onToggleCart={() => toggleCart(verb.id)}
                />
              ))}
            </div>
          )}

          {!focusBase && <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />}
          {!focusBase && totalPages > 0 && filtered.length > 0 && (
            <p className="mt-3 text-center text-xs text-slate-500">
              Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} de{" "}
              {filtered.length} verbos
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
        <p>Diccionario Interactivo de Verbos en Inglés &bull; Creado para aprendizaje efectivo.</p>
      </footer>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/40 transition hover:bg-indigo-500 hover:scale-105"
      >
        <span className="text-lg">🛒</span>
        Mi lista
        {cart.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-extrabold text-indigo-700">
            {cart.length}
          </span>
        )}
      </button>

      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        verbs={cartVerbs}
        onRemove={(id) => setCart((prev) => prev.filter((x) => x !== id))}
        onClear={() => setCart([])}
      />
    </div>
  );
}
