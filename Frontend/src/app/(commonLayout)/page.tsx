import MediCards from "@/components/modules/HomePage/MediCards";
import { mediService } from "@/services/medi.server";
import { Medicine } from "@/types/medi.service";
import { Category, categoryService } from "@/services/category.server";
import HeroMedicine from "@/components/layout/banner";
import { Help1 } from "@/components/layout/help1";
import { Logos8 } from "@/components/layout/logos8";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeSections from "@/components/layout/HomeSections";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const limit = 9;

  let medicines: Medicine[] = [];
  let meta = { total: 0 };
  let catalogueError = false;

  try {
    const response = await mediService.getMedicines(
      { search: search || "", page: 1, limit },
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
    const total = Number(payload?.meta?.total ?? payload?.data?.meta?.total);
    meta.total = Number.isFinite(total) ? total : medicines.length;
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

  const allProductsHref = "/store" + (search ? "?search=" + encodeURIComponent(search) : "");

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
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {search ? "Products matching " + '"' + search + '"' : "Products"}
              </h2>
              <Link
                href={allProductsHref}
                className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                View More <ArrowRight className="size-4" />
              </Link>
            </div>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {medicines.map((medicine) => (
                <MediCards key={medicine.id} medicine={medicine} />
              ))}
            </div>
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
        </section>
      </div>

      <HomeSections categories={categories} />
      <Logos8 />
      <Help1 />
    </main>
  );
}
