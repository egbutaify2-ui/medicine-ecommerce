"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export default function OrderButtons({ medicineId, name, price, image, stock = 0 }: any) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state: any) => state.addItem);
  const availableStock = Math.max(0, Number(stock) || 0);

  const handleAddToCart = () => {
    if (!availableStock) return toast.error("This product is currently out of stock.");
    if (quantity > availableStock) return toast.error(`Only ${availableStock} unit(s) are available.`);
    addItem({ id: medicineId, name, price: Number(price), image, stock: availableStock, qty: quantity });
    toast.success(`${quantity} ${name} added to your cart.`);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-fit items-center gap-4 rounded-2xl bg-slate-100 p-2">
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1}><Minus size={16} /></Button>
        <span className="w-8 text-center text-lg font-bold">{quantity}</span>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm" onClick={() => setQuantity((value) => Math.min(availableStock || 1, value + 1))} disabled={quantity >= availableStock}><Plus size={16} /></Button>
      </div>
      <Button onClick={handleAddToCart} disabled={!availableStock} className="h-14 flex-1 rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
        <ShoppingCart className="mr-2 h-5 w-5" />{availableStock ? `Add to Cart — Tk ${(Number(price) * quantity).toLocaleString("en-BD")}` : "Out of stock"}
      </Button>
    </div>
  );
}
