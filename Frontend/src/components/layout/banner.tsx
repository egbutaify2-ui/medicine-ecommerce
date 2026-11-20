import { ShieldCheck, Truck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { FallbackImage } from "@/components/ui/FallbackImage";

export default function HeroMedicine({ className }: { className?: string }) {
  return (
    <section className={cn("relative w-full overflow-hidden bg-[#f8fafc] dark:bg-black", className)}>
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-green-100 blur-3xl opacity-60 dark:bg-green-900/20" />
      <div className="container relative mx-auto px-4 pt-8 md:pt-30">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" /></span>
              Your online healthcare store
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white lg:text-7xl">Your Health,<br /><span className="text-green-600">Our Priority.</span></h1>
              <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:text-xl">Browse healthcare essentials, compare products and place an order from the comfort of your home.</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
              <FeatureItem icon={<ShieldCheck />} text="Trusted products" />
              <FeatureItem icon={<Truck />} text="Delivery options" />
              <FeatureItem icon={<CreditCard />} text="Secure checkout" />
            </div>
          </div>
          <div className="mx-auto w-full max-w-[560px]">
            <FallbackImage src="/images/medicine-hero.svg" alt="Illustration of a pharmacy bag and healthcare essentials" className="h-auto w-full object-contain" loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200"><span className="size-5 text-green-600">{icon}</span><span className="text-sm">{text}</span></div>;
}
