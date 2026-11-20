"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const Footer2 = ({ className }: { className?: string }) => (
  <section className={cn("border-t bg-slate-50 py-14 dark:bg-slate-950", className)}>
    <div className="container mx-auto px-4">
      <footer>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3"><img src="/my-logo.png" alt="MediStore" className="h-12 w-auto object-contain" /><span className="text-2xl font-bold tracking-tight">MediStore</span></Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Browse healthcare essentials, manage your cart and review your orders in one place.</p>
          </div>
          <div><h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Explore</h3><ul className="space-y-3 text-sm text-muted-foreground"><li><Link className="hover:text-primary" href="/#categories">Shop categories</Link></li><li><Link className="hover:text-primary" href="/about">About MediStore</Link></li><li><Link className="hover:text-primary" href="/help">Help center</Link></li></ul></div>
          <div><h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Customer service</h3><ul className="space-y-3 text-sm text-muted-foreground"><li><Link className="hover:text-primary" href="/contact">Contact us</Link></li><li><Link className="hover:text-primary" href="/customer-dashboard/myOrders">Order history</Link></li><li><Link className="hover:text-primary" href="/login">Sign in</Link></li></ul></div>
          <div><h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Need help?</h3><p className="mb-4 text-sm leading-relaxed text-muted-foreground">Visit the help center for questions about browsing, carts and orders.</p><div className="flex flex-col gap-3 text-sm"><Link href="/help" className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"><MessageCircle className="size-4" />Help center</Link><Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"><Mail className="size-4" />Contact page</Link></div></div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row"><p>© {new Date().getFullYear()} MediStore. All rights reserved.</p><p>Preview store · Sample catalogue items are for testing only.</p></div>
      </footer>
    </div>
  </section>
);

export { Footer2 };
