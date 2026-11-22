import MediCards from "@/components/modules/HomePage/MediCards";
import CategorySection from "@/components/modules/HomePage/CategorySection";
import { mediService } from "@/services/medi.server";
import { Medicine } from "@/types/medi.service";
import { Category, categoryService } from "@/services/category.server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const dynamic = "force-dynamic";

type CatalogueSearchParams = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<CatalogueSearchParams>;
}) {
  const params = await searchParams;
  const { search, category, minPrice, maxPrice } = params;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const limit = 12;

  let medicines: Medicine[] = [];
  let meta = { total: 0, totalPages: 0 };
  let catalogueError = false;

  try {
    const response = await mediService.getMedicines(
      {
        search: search || "",
        categoryId: category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: currentPage,
        limit,
      },
      { cache: "no-store" }
    );

    if ((response as any)?.error) {
      throw new Error((response as any).error.message || "Medicine API request failed");
    }

    const payload = (response as any)?.data;
    if (payload?.success === false) {
      throw new Error(payload.message || "Medicine API returned an error");
    }

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
    console.error("Could not load all products:", error);
  }

  let categories: Category[] = [];
  try {
    const response = await categoryService.getCategories({ cache: "no-store" });
    categories = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Could not load product categories:", error);
  }

  const createPageURL = (nextPage: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (category) query.set("category", category);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);
    query.set("page", String(nextPage));
    return "/store?" + query.toString();
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-16 pt-28 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-1 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">All Products</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Browse the full range of available medicines and healthcare products.
            </p>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            {catalogueError ? "Catalogue unavailable" : meta.total + " active products"}
          </span>
        </div>

        <form action="/store" method="get" className="mb-8 flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="search"
            defaultValue={search || ""}
            placeholder="Search medicines by name..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {category && <input type="hidden" name="category" value={category} />}
          {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
          {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
          <button type="submit" className="h-11 shrink-0 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700">
            Search
          </button>
        </form>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 space-y-4 lg:w-72">
            <CategorySection categories={categories} basePath="/store" />
          </aside>

          <section className="min-w-0 w-full">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {category ? "Filtered Products" : "Browse All Products"}
              </h2>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Page {currentPage}{meta.totalPages ? " of " + meta.totalPages : ""}
              </span>
            </div>

            {catalogueError ? (
              <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50 py-20 text-center dark:border-amber-900 dark:bg-amber-950/20">
                <p className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
                  We couldn’t load the product catalogue right now.
                </p>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                  Please try again. Your products have not been removed.
                </p>
                <Link href="/store" className="font-bold text-blue-600 hover:underline">Try again</Link>
              </div>
            ) : medicines.length ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {medicines.map((medicine) => (
                    <MediCards key={medicine.id} medicine={medicine} />
                  ))}
                </div>

                {meta.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        {Array.from({ length: meta.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink href={createPageURL(pageNumber)} isActive={pageNumber === currentPage}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href={currentPage < meta.totalPages ? createPageURL(currentPage + 1) : "#"}
                            className={currentPage >= meta.totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-4 text-lg italic text-slate-400">
                  {search || category || minPrice || maxPrice
                    ? "No active products match those filters."
                    : "No active products are available right now."}
                </p>
                {(search || category || minPrice || maxPrice) && (
                  <Link href="/store" className="font-bold text-blue-600 hover:underline">Clear all filters</Link>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
