"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, X, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { handleOrderAction } from "@/actions/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FallbackImage } from "@/components/ui/FallbackImage";

export function CartDropdown() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { items, removeItem, clearCart } = useCartStore() as any;
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.price) * Number(item.qty || 1), 0);
  const formatPrice = (price: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(price);

  const handleCheckout = async () => {
    if (!items.length) return toast.error("Your cart is empty.");
    if (!session) {
      toast.error("Please sign in to place your order.");
      router.push(`/login?callbackUrl=${encodeURIComponent("/customer-dashboard/myOrders")}`);
      return;
    }
    if (!address.trim() || !phone.trim()) return toast.error("Enter your delivery address and phone number.");

    setIsSubmitting(true);
    try {
      const result = await handleOrderAction(items, address.trim(), phone.trim());
      if (result.error) throw new Error(result.error);
      clearCart();
      setAddress("");
      setPhone("");
      toast.success("Order placed successfully.");
      router.push("/customer-dashboard/myOrders");
      router.refresh();
    } catch (error: any) {
      toast.error(`Order failed: ${error?.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Open shopping cart">
          <ShoppingCart className="size-5" />
          {items.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{items.reduce((n: number, item: any) => n + Number(item.qty || 1), 0)}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-4 w-[min(24rem,calc(100vw-1.5rem))] rounded-xl p-5 shadow-xl" align="end">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Shopping Cart</h2>
        {!items.length ? (
          <div className="space-y-3 py-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">Your cart is empty.</p>
            <Button className="w-full gap-2 rounded-xl" variant="outline" onClick={() => router.push("/customer-dashboard/myOrders")}><PackageSearch className="size-4" /> View previous orders</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border p-2">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-slate-50"><FallbackImage src={item.image} alt={item.name} className="h-full w-full object-contain" /></div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{item.name}</h4>
                    <p className="text-[11px] font-medium text-slate-400">Qty: {item.qty}</p>
                    <p className="text-sm font-bold text-blue-600">{formatPrice(Number(item.price) * Number(item.qty || 1))}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="size-8 rounded-full hover:bg-red-50 hover:text-red-500" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><X className="size-4" /></Button>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between py-1"><span className="text-xs font-bold uppercase text-slate-500">Subtotal</span><span className="text-lg font-black text-slate-900 dark:text-white">{formatPrice(subtotal)}</span></div>
            <div className="space-y-3">
              <div><label htmlFor="checkout-address" className="mb-1 block text-xs font-semibold text-slate-600">Delivery address</label><Input id="checkout-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House, street, city" /></div>
              <div><label htmlFor="checkout-phone" className="mb-1 block text-xs font-semibold text-slate-600">Phone number</label><Input id="checkout-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Your contact number" /></div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="h-11 w-full rounded-xl bg-blue-600 font-bold hover:bg-blue-700" onClick={handleCheckout} disabled={isSubmitting}>{isSubmitting ? "Placing order..." : session ? "Place order" : "Sign in to checkout"}</Button>
              <Button variant="outline" className="w-full gap-2 rounded-xl font-bold text-slate-500" onClick={() => router.push("/customer-dashboard/myOrders")}><PackageSearch className="size-4" /> Order history</Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
