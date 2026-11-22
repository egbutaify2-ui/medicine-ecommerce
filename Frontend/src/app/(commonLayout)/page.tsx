import MediCards from "@/components/modules/HomePage/MediCards";
import { mediService } from "@/services/medi.server";
import { Medicine } from "@/types/medi.service";
import { Category, categoryService } from "@/services/category.server";
import HeroMedicine from "@/components/layout/banner";
import { Help1 } from "@/components/layout/help1";
import { Logos8 } from "@/components/layout/logos8";
import Link from "next/link";
import HomeSections from "@/components/layout/HomeSections";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const dynamic = "force-dynamic";

type HomeSearchParams = {
  search?: string;
  page?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = 9;

  let medicines: Medicine[] = [];
  let meta = { total: 0, totalPages: 0 };
  let catalogueError = false;

  try {
    const response = await mediService.getMedicines(
      { search, page: currentPage, limit },
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
    const resolvedTotal = Number.isFinite(total) ? total : medicines.length;
    meta = {
      total: resolvedTotal,
      totalPages:
        Number.isFinite(totalPages) && totalPages > 0
          ? totalPages
          : Math.ceil(resolvedTotal / limit),
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
    query.set("page", String(nextPage));
    return "/?" + query.toString();
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-black">
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-900">
          Preview environment: sample catalogue items and test orders only. No real orders will be fulfilled.
        </div>
      )}
      <HeroMedicine />

      <div className="container mx-auto px-4 pb-10">
        <section className="mt-8 w-full">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {search ? 'Products matching "' + search + '"' : "Products"}
            </h2>
            <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600 dark:bg-blue-900/20">
              {catalogueError ? "Catalogue unavailable" : meta.total + " items"}
            </span>
          </div>

          {catalogueError ? (
            <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50 py-20 text-center dark:border-amber-900 dark:bg-amber-950/20">
              <p className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
                We couldn’t load the medicine catalogue right now.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please try again. Your products have not been removed.
              </p>
            </div>
          ) : medicines.length ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {medicines.map((medicine) => (
                  <MediCards key={medicine.id} medicine={medicine} />
                ))}
              </div>

              {meta.totalPages > 1 && (
                <div className="mt-10">
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
                          <PaginationLink
                            href={createPageURL(pageNumber)}
                            isActive={pageNumber === currentPage}
                          >
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
                {search ? "No products match your search." : "No products have been added yet."}
              </p>
              {search && (
                <Link href="/store" className="font-bold text-blue-600 hover:underline">
                  Browse all products
                </Link>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href={"/store" + (search ? "?search=" + encodeURIComponent(search) : "")} className="text-sm font-semibold text-blue-600 hover:underline">
              Browse full catalogue
            </Link>
          </div>
        </section>
      </div>

      <HomeSections categories={categories} />
      <Logos8 />
      <Help1 />
    </main>
  );
}
