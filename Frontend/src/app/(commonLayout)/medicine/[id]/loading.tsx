export default function MedicineLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto pt-24 px-4 mb-10 animate-pulse">
      <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="h-96 lg:h-[560px] bg-slate-100 dark:bg-zinc-900" />
          <div className="p-8 md:p-14 space-y-6">
            <div className="h-6 w-32 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="h-12 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="h-24 rounded-2xl bg-slate-100 dark:bg-zinc-900" />
            <div className="h-32 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
            <div className="h-14 rounded-2xl bg-blue-100 dark:bg-blue-950" />
          </div>
        </div>
      </div>
    </div>
  );
}
