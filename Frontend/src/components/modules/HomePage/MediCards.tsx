import React from "react";
import { Medicine } from "@/types/medi.service";
import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";

const MediCard: React.FC<{ medicine: Medicine }> = ({ medicine }) => {
  const available = medicine.isActive && medicine.stock > 0;
  return (
    <article className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="relative mb-4 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
        <FallbackImage src={medicine.image} alt={medicine.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm dark:bg-slate-700">{medicine.category?.categoryName || "Healthcare"}</span>
        {!available && <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-bold uppercase text-red-600 dark:bg-black/60">Not available</span>}
      </div>
      <div className="mb-2">
        <h2 className="truncate text-base font-bold text-slate-800 dark:text-slate-100">{medicine.name}</h2>
        <p className="text-[11px] font-medium text-slate-400">Manufacturer: {medicine.manufacturer}</p>
      </div>
      <p className="mb-4 h-10 line-clamp-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{medicine.description}</p>
      <div className="mb-5 flex items-end justify-between">
        <span className="text-xl font-black text-blue-600 dark:text-blue-400">Tk {Number(medicine.price).toLocaleString("en-BD")}</span>
        <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${available ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"}`}>{available ? `${medicine.stock} in stock` : "Out of stock"}</span>
      </div>
      <Link href={`/medicine/${medicine.id}`} aria-disabled={!available} className={`mt-auto w-full rounded-xl py-2.5 text-center text-sm font-bold transition-all ${available ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 dark:shadow-none" : "pointer-events-none cursor-not-allowed bg-slate-200 text-slate-400"}`}>{available ? "View product" : "Unavailable"}</Link>
    </article>
  );
};
export default MediCard;
