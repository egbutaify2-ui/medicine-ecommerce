import { Badge } from "@/components/ui/badge";
import { mediService } from "@/services/medi.server";
import { Medicine } from "@/types/medi.service";
import { Building2, Star, CheckCircle2, ShieldCheck } from "lucide-react";
import OrderButtons from "../OrderButtons";
import ReviewFormModal from "@/components/layout/ReviewFormModal";
import BackButton from "../BackButton";
import { FallbackImage } from "@/components/ui/FallbackImage";

export const dynamic = "force-dynamic";

export default async function MedicinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: medicineResponse } = await mediService.getMedicinesById(id);
  const medicine: Medicine = medicineResponse?.data;

  if (!medicine) return <div className="min-h-[60vh] px-4 pt-32 text-center"><h1 className="text-3xl font-bold">Product not found</h1><p className="mt-3 text-muted-foreground">This product may have been removed or is no longer available.</p></div>;

  const reviews = medicine.reviews || [];
  const averageRating = reviews.length ? (reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const available = medicine.isActive && medicine.stock > 0;

  return (
    <div className="mx-auto mb-10 w-full max-w-7xl px-4 pt-24">
      <BackButton />
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Preview catalogue item — sample data for testing only; not a real product offer.</div>}
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col lg:flex-row">
          <div className="relative flex items-center justify-center bg-[#f8fafc] p-6 dark:bg-zinc-900 md:p-12 lg:w-1/2">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="relative h-80 w-full max-w-md"><FallbackImage src={medicine.image} alt={medicine.name} className="h-full w-full object-contain transition-transform duration-700 hover:scale-105" /></div>
          </div>
          <div className="flex flex-col gap-8 p-8 md:p-14 lg:w-1/2">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-blue-600 px-4 py-1 text-[10px] font-bold uppercase text-white">{medicine.category?.categoryName || "Healthcare"}</Badge>
                <Badge variant="outline" className={available ? "border-emerald-200 bg-emerald-50/50 text-emerald-600" : "border-red-200 bg-red-50 text-red-600"}>{available ? "In stock" : "Out of stock"}</Badge>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">{medicine.name}</h1>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-slate-500">
                <div className="flex items-center gap-2.5"><div className="rounded-lg bg-blue-50 p-2 text-blue-600"><Building2 size={18} /></div><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{medicine.manufacturer}</span></div>
                <div className="flex items-center gap-2.5"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><ShieldCheck size={18} /></div><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product information</span></div>
              </div>
            </div>
            <div className="space-y-3"><h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Product overview</h3><p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">{medicine.description}</p></div>
            <div className="flex items-center justify-between rounded-[1.5rem] bg-slate-900 p-8 text-white shadow-xl">
              <div><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</p><h2 className="text-4xl font-bold">৳{Number(medicine.price).toLocaleString("en-BD")}</h2></div>
              <div className="text-right"><p className="text-2xl font-bold">{medicine.stock}</p><p className="text-[10px] font-bold uppercase text-slate-400">Units available</p></div>
            </div>
            <OrderButtons medicineId={medicine.id} name={medicine.name} price={medicine.price} image={medicine.image} stock={medicine.stock} />
          </div>
        </div>
        <div className="border-t border-slate-50 bg-slate-50/30 p-8 dark:border-zinc-800 dark:bg-zinc-900/30 md:p-14">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-6"><h3 className="text-2xl font-bold text-slate-900 dark:text-white">Customer reviews</h3><div className="flex items-center gap-2"><div className="flex gap-0.5">{[1,2,3,4,5].map((star) => <Star key={star} size={18} className={star <= Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />)}</div><span className="ml-2 text-lg font-bold">{averageRating} / 5.0</span></div><p className="text-sm text-slate-500">Based on {reviews.length} reviews.</p></div>
            <div className="space-y-8 lg:col-span-2">
              <div className="max-h-112.5 space-y-5 overflow-y-auto py-5 pr-4">
                {reviews.length ? reviews.map((review: any) => <div key={review.id} className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">V</div><div><div className="flex items-center gap-1.5"><span className="text-sm font-bold text-slate-800 dark:text-slate-200">Verified customer</span><CheckCircle2 size={14} className="text-blue-500" /></div><div className="flex gap-0.5">{[...Array(5)].map((_, index) => <Star key={index} size={10} className={index < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />)}</div></div></div><span className="text-[11px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span></div><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">"{review.comment}"</p></div>) : <div className="py-10 text-center italic text-slate-400">No reviews yet.</div>}
              </div>
              <ReviewFormModal medicineId={medicine.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
