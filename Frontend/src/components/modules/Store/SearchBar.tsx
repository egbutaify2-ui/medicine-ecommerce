 "use client";

import { useState, useEffect, useRef } from "react";
import { Search, Pill, Loader2, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && !query.trim()) setIsMobileOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchSearch = async () => {
      const term = query.trim();
      if (term.length < 2) { setResults([]); setIsLoading(false); return; }
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ q: term });
        const response = await fetch(`/api/medicines/search?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Search failed: ${response.status}`);
        const payload = await response.json();
        setResults(Array.isArray(payload.data) ? payload.data : []);
      } catch (error: any) {
        if (error?.name !== "AbortError") { console.error("Medicine search failed:", error); setResults([]); }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    const timer = window.setTimeout(fetchSearch, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  const clearSearch = () => { setQuery(""); setResults([]); };

  return (
    <div className="relative flex items-center" ref={searchRef}>
      {!isMobileOpen && <button type="button" onClick={() => setIsMobileOpen(true)} aria-label="Open search" className="rounded-full p-2 hover:bg-slate-100 lg:hidden"><Search className="size-5 text-slate-600" /></button>}
      <div className={cn("flex h-10 items-center rounded-full border bg-slate-100 transition-all duration-300 dark:bg-slate-800", isMobileOpen ? "fixed inset-x-2 top-2 z-[100] bg-white px-3 shadow-lg dark:bg-slate-900 lg:relative lg:inset-auto lg:w-full lg:shadow-none" : "hidden px-3 lg:flex lg:w-full lg:max-w-[300px] lg:bg-white")}>
        {isMobileOpen && <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Close search" className="mr-2 lg:hidden"><ArrowLeft className="size-5 text-slate-500" /></button>}
        <Search className="hidden size-4 shrink-0 text-slate-400 lg:block" />
        <input type="search" placeholder="Search products..." className="ml-2 w-full bg-transparent py-2 text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setIsMobileOpen(true)} autoFocus={isMobileOpen} />
        {isLoading && <Loader2 className="size-4 animate-spin text-blue-500" />}
        {query && <button type="button" onClick={clearSearch} aria-label="Clear search" className="rounded-full p-1 hover:bg-slate-200"><X className="size-4 text-slate-400" /></button>}
      </div>
      {query.trim().length >= 2 && <div className={cn("absolute right-0 top-[calc(100%+8px)] z-[120] min-w-75 overflow-hidden rounded-xl border bg-white shadow-2xl dark:bg-slate-900", isMobileOpen ? "fixed inset-x-2 top-14 w-auto" : "w-full")}><div className="max-h-87.5 overflow-y-auto p-2">
        {results.length ? results.map((item) => <Link key={item.id} href={`/medicine/${item.id}`} onClick={() => { clearSearch(); setIsMobileOpen(false); }} className="group flex items-center gap-3 rounded-lg border-b border-slate-50 px-3 py-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30"><Pill className="size-5 text-blue-600" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</p><p className="text-[11px] font-semibold text-blue-600">Tk {item.price}</p></div></Link>) : !isLoading && <div className="p-6 text-center"><p className="text-xs italic text-muted-foreground">No matching products for "{query}".</p></div>}
      </div></div>}
    </div>
  );
}
