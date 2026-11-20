import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = { id: string; name: string; price: number; image?: string; stock?: number; qty?: number; [key: string]: any };
type CartState = { items: Product[]; addItem: (product: Product) => void; removeItem: (id: string) => void; clearCart: () => void };

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => {
        const incomingQty = Math.max(1, Number(product.qty) || 1);
        const stockLimit = Number.isFinite(Number(product.stock)) ? Number(product.stock) : Number.POSITIVE_INFINITY;
        const existing = state.items.find((item) => item.id === product.id);
        if (existing) {
          return { items: state.items.map((item) => item.id === product.id ? { ...item, ...product, qty: Math.min((Number(item.qty) || 0) + incomingQty, stockLimit) } : item) };
        }
        return { items: [...state.items, { ...product, qty: Math.min(incomingQty, stockLimit) }] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "medistore-cart" }
  )
);
