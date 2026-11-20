import MediCards from "@/components/modules/HomePage/MediCards";
import CategorySection from "@/components/modules/HomePage/CategorySection";
import { mediService } from "@/services/medi.server";
import { Medicine } from "@/types/medi.service";
import { Category, categoryService } from "@/services/category.server";
import HeroMedicine from "@/components/layout/banner";
import { Help1 } from "@/components/layout/help1";
import { Logos8 } from "@/components/layout/logos8";
import Link from "next/link";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import HomeSections from "@/components/layout/HomeSections";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; minPrice?: string; maxPrice?: string; page?: string }> }) {
  const params = await searchParams;
  const { search, category, minPrice, maxPrice, page = "1" } = params;
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = 9;
  let medicines: Medicine[] = [];
  let meta = { total: 0, totalPages: 0 };
  let catalogueError = false;

  try {
    const response = await mediService.getMedicines({
      search: search || "", categoryId: category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: currentPage, limit,
    }, { cache: "no-store" });

    if ((response as any)?.error) {
      throw new Error((response as any).error.message || "Medicine API request failed");
    }

    const payload = (response as any)?.data;
    if (payload?.success === false) {
      throw new Error(payload.message || "Medicine API returned an error");
    }

    // Accept the API envelope used by this backend as well as its nested
    // legacy response shape. A failed/unknown response must not look like
    // a successful empty catalogue.
    const candidates = [
      payload?.data,
      payload?.data?.data,
      payload?.medicines,
      payload,
    ];
    const medicineList = candidates.find(Array.isArray) as Medicine[] | undefined;

    if (!medicineList) {
      throw new Error("Medicine API returned an unexpected response shape");
    }

    medicines = medicineList;
    const responseMeta = payload?.meta ?? payload?.data?.meta;
    const total = Number(responseMeta?.total);
    const totalPages = Number(responseMeta?.totalPages);
    meta = {
      total: Number.isFinite(total) ? total : medicines.length,
      totalPages: Number.isFinite(totalPages) ? totalPages : (medicines.length > 0 ? 1 : 0),
    };
  } catch (error) {
    catalogueError = true;
    console.error("Could not load medicine catalogue:", error);
  }

  let categories: Category[] = [];
  try {
    const response = await categoryService.getCategories({ cache: "no-store" });
    categories = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Could not load categories:", error);
  }

  const createPageURL = (nextPage: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (category) query.set("category", category);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);
    query.set("page", String(nextPage));
    return `/?${query.toString()}`;
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-black">
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-900">Preview environment: sample catalogue items and test orders only. No real orders will be fulfilled.</div>}
      <HeroMedicine />
      <div className="container mx-auto px-4 pb-10">
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 space-y-4 lg:w-72"><CategorySection categories={categories} /></aside>
          <section className="w-full lg:w-3/4">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{search ? `Results for "${search}"` : "All Medicines"}</h2>
              <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600 dark:bg-blue-900/20">{catalogueError ? "Catalogue unavailable" : `${meta.total} items found`}</span>
            </div>
            {catalogueError ? (
              <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50 py-20 text-center dark:border-amber-900 dark:bg-amber-950/20">
                <p className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">We couldn’t load the medicine catalogue right now.</p>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Please try again. Your products have not been removed.</p>
                <Link href={createPageURL(1)} className="font-bold text-blue-600 hover:underline">Try again</Link>
              </div>
            ) : medicines.length ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{medicines.map((medicine: any) => <MediCards key={medicine.id} medicine={medicine} />)}</div>
                {meta.totalPages > 1 && <div className="mt-12"><Pagination><PaginationContent>
                  <PaginationItem><PaginationPrevious href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"} className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""} /></PaginationItem>
                  {Array.from({ length: meta.totalPages }, (_, index) => index + 1).map((number) => <PaginationItem key={number}><PaginationLink href={createPageURL(number)} isActive={number === currentPage}>{number}</PaginationLink></PaginationItem>)}
                  <PaginationItem><PaginationNext href={currentPage < meta.totalPages ? createPageURL(currentPage + 1) : "#"} className={currentPage >= meta.totalPages ? "pointer-events-none opacity-50" : ""} /></PaginationItem>
                </PaginationContent></Pagination></div>}
              </>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-4 text-lg italic text-slate-400">{search || category ? "No medicines match those filters." : "No medicines have been added yet."}</p>
                {(search || category || minPrice || maxPrice) && <Link href="/" className="font-bold text-blue-600 hover:underline">Clear filters</Link>}
              </div>
            )}
          </section>
        </div>
      </div>
      <HomeSections categories={categories} />
      <Logos8 />
      <Help1 />
    </main>
  );
}
