"use client";

import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";

type Category = { id: string; categoryName: string };

const promos = [
  { title: "A healthier everyday", desc: "Explore practical healthcare essentials for home and family.", image: "/images/promo-rewards.svg", bg: "bg-amber-50", href: "/help", cta: "How it works" },
  { title: "Shop from home", desc: "Browse the catalogue and review your order before checkout.", image: "/images/promo-delivery.svg", bg: "bg-blue-50", href: "/contact", cta: "Contact us" },
];
const categoryImages = ["/images/category-first-aid.svg", "/images/category-health-devices.svg", "/images/category-personal-care.svg", "/images/category-wellness.svg"];

export default function HomeSections({ categories = [] }: { categories?: Category[] }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          {promos.map((item) => (
            <div key={item.title} className={`relative flex items-center justify-between overflow-hidden rounded-2xl p-7 shadow-sm transition duration-300 hover:-translate-y-1 ${item.bg}`}>
              <div className="relative z-10 max-w-xs">
                <h3 className="mb-2 text-2xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
                <Link href={item.href} className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100">{item.cta}</Link>
              </div>
              <FallbackImage src={item.image} alt="" aria-hidden="true" className="hidden h-36 w-36 object-contain sm:block" />
            </div>
          ))}
        </div>
        <div id="categories" className="scroll-mt-28">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 sm:text-left">Browse Categories</h2>
          {categories.length ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {categories.map((category, index) => (
                <Link key={category.id} href={`/store/${category.id}`} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:shadow-xl">
                  <div className="relative h-48 w-full">
                    <FallbackImage src={categoryImages[index % categoryImages.length]} alt="" aria-hidden="true" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute bottom-5 left-5"><h3 className="text-xl font-bold tracking-wide text-white">{category.categoryName}</h3><span className="text-xs font-medium uppercase tracking-widest text-white/85">Explore category →</span></div>
                </Link>
              ))}
            </div>
          ) : <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Categories will appear here as the catalogue is added.</p>}
        </div>
      </div>
    </section>
  );
}
