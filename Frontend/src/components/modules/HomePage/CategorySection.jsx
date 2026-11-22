"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, CircleDollarSign, X, Check } from "lucide-react";
import PriceFilter from "./PriceFilter";

const CategorySection = ({ categories, basePath = "/" }) => {
    const searchParams = useSearchParams();
    const [activeDrawer, setActiveDrawer] = useState(null);

    const activeCategory = searchParams.get("category");
    const closeDrawer = () => setActiveDrawer(null);

    const categoryHref = (categoryId) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId) params.set("category", categoryId);
        else params.delete("category");
        params.set("page", "1");
        const query = params.toString();
        return query ? basePath + "?" + query : basePath;
    };

    return (
        <div className="ml-15 md:ml-0">
            <div className="flex gap-2 rounded-2xl border bg-white p-4 sticky top-0 z-20 lg:hidden">
                <button
                    onClick={() => setActiveDrawer("category")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-700 active:bg-slate-100"
                >
                    <LayoutGrid size={18} className="text-blue-600" />
                    Categories
                </button>
                <button
                    onClick={() => setActiveDrawer("price")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-700 active:bg-slate-100"
                >
                    <CircleDollarSign size={18} className="text-emerald-600" />
                    Price Filter
                </button>
            </div>

            {activeDrawer && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeDrawer} />
                    <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] animate-in slide-in-from-bottom rounded-t-[24px] p-6 shadow-2xl overflow-y-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-black text-slate-900">
                                {activeDrawer === "category" ? "Select Category" : "Set Price Range"}
                            </h2>
                            <button onClick={closeDrawer} className="rounded-full bg-slate-100 p-2 text-slate-500" aria-label="Close filters">
                                <X size={20} />
                            </button>
                        </div>

                        {activeDrawer === "category" ? (
                            <div className="grid grid-cols-1 gap-3">
                                <Link
                                    href={categoryHref(null)}
                                    onClick={closeDrawer}
                                    className={"flex items-center justify-between rounded-2xl border p-4 " + (!activeCategory ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-100 bg-slate-50")}
                                >
                                    <span className="font-bold">All Products</span>
                                    {!activeCategory && <Check size={18} />}
                                </Link>
                                {categories.map((category) => {
                                    const categoryId = category._id || category.id;
                                    const isActive = activeCategory === categoryId;
                                    return (
                                        <Link
                                            key={categoryId}
                                            href={categoryHref(categoryId)}
                                            onClick={closeDrawer}
                                            className={"flex items-center justify-between rounded-2xl border p-4 " + (isActive ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-100 bg-slate-50")}
                                        >
                                            <span className="font-bold">{category.categoryName}</span>
                                            {isActive && <Check size={18} />}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="pb-4">
                                <PriceFilter basePath={basePath} />
                                <button onClick={closeDrawer} className="mt-4 w-full py-3 text-sm font-medium text-slate-500">
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="hidden w-full max-w-[280px] space-y-4 lg:block">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 border-b pb-2 text-[16px] font-black text-slate-800">Product Categories</h2>
                    <div className="space-y-3">
                        <Link href={categoryHref(null)} className="group flex items-center gap-3">
                            <input type="checkbox" checked={!activeCategory} readOnly className="h-4 w-4 cursor-pointer rounded text-blue-600" />
                            <span className={"text-sm font-bold transition-colors group-hover:text-blue-600 " + (!activeCategory ? "text-blue-600" : "text-slate-600")}>All Products</span>
                        </Link>
                        {categories.map((category) => {
                            const categoryId = category._id || category.id;
                            const isActive = activeCategory === categoryId;
                            return (
                                <Link key={categoryId} href={categoryHref(categoryId)} className="group flex items-center gap-3">
                                    <input type="checkbox" checked={isActive} readOnly className="h-4 w-4 cursor-pointer rounded text-blue-600" />
                                    <span className={"text-sm font-bold transition-colors group-hover:text-blue-600 " + (isActive ? "text-blue-600" : "text-slate-600")}>{category.categoryName}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <PriceFilter basePath={basePath} />
            </div>
        </div>
    );
};

export default CategorySection;
