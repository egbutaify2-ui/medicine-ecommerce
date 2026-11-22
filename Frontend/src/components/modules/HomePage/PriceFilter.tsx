"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function PriceFilter({ basePath = "/" }: { basePath?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const min = Number(searchParams.get("minPrice")) || 0;
    const max = Number(searchParams.get("maxPrice")) || 1000;
    const [range, setRange] = useState([min, max]);

    const handleSliderChange = (value: number[]) => setRange(value);

    const applyFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", range[0].toString());
        params.set("maxPrice", range[1].toString());
        params.set("page", "1");
        router.push(basePath + "?" + params.toString());
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-1 text-lg font-bold text-slate-800 dark:text-white">Price Range</h3>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                Set your budget range (Tk {range[0]} - Tk {range[1]}).
            </p>
            <div className="mb-6 px-2">
                <Slider defaultValue={[min, max]} max={2000} step={10} onValueChange={handleSliderChange} className="cursor-pointer" />
            </div>
            <Button onClick={applyFilter} className="w-full rounded-xl bg-blue-600 py-2.5 font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98]">
                Apply Filter
            </Button>
        </div>
    );
}
