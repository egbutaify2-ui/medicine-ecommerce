import MediCards from "@/components/modules/HomePage/MediCards";
import { mediService } from "@/services/medi.server";
import { Medicine } from "@/types/medi.service";

export const dynamic = "force-dynamic";

export default async function StorePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ search?: string }> }) {
  const { id } = await params;
  const { search } = await searchParams;
  const { data: payload } = await mediService.getMedicines({ categoryId: id, search: search || "" });
  const medicines: Medicine[] = Array.isArray(payload?.data) ? payload.data : [];

  return (
    <div className="container mx-auto mt-28 min-h-[50vh] px-4">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row"><div><h1 className="text-2xl font-bold">Available products</h1><p className="text-sm text-muted-foreground">Browse items in this category.</p></div></div>
      {medicines.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{medicines.map((medicine) => <MediCards key={medicine.id} medicine={medicine} />)}</div> : <div className="rounded-xl border-2 border-dashed bg-slate-50 py-20 text-center dark:bg-slate-900"><p className="text-muted-foreground">No products found in this category.</p></div>}
    </div>
  );
}
