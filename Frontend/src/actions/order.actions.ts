"use server";

import { orderService } from "@/services/order.server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function handleOrderAction(items: any[], shippingAddress: string, phoneNumber: string) {
  if (!Array.isArray(items) || !items.length) return { data: null, error: "Your cart is empty." };
  const orderData = {
    shippingAddress,
    phoneNumber,
    items: items.map((item: any) => ({ medicineId: String(item.id || item.medicineId || ""), quantity: Number(item.qty || item.quantity || 1) })),
  };
  const result = await orderService.createOrder(orderData);
  if (result.data) {
    revalidateTag("orders", "");
    revalidateTag("medicines", "max");
    revalidatePath("/customer-dashboard/myOrders");
  }
  return result;
}

export async function updateOrderStatusAction(id: string, newStatus: string) {
  try {
    const result = await orderService.updateOrdersStatus(id, { status: newStatus } as any);
    if (result.error) return { success: false, error: result.error.message };
    revalidatePath("/admin-dashboard/customerOrders");
    revalidatePath("/seller-dashboard/customerOrders");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update order status." };
  }
}
