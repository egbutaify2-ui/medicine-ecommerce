import { Request, Response } from "express";
import { OrderStatus } from "../../../generated/prisma/enums";
import { ordersService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { shippingAddress, items, phoneNumber } = req.body ?? {};
    if (!shippingAddress?.trim() || !phoneNumber?.trim() || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: "Shipping address, phone number and at least one item are required." });
    }
    const normalizedItems = items.map((item: any) => ({ medicineId: String(item.medicineId || ""), quantity: Number(item.quantity) }));
    if (normalizedItems.some((item: any) => !item.medicineId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return res.status(400).json({ success: false, message: "Each item must have a valid medicine ID and positive whole-number quantity." });
    }
    const order = await ordersService.createOrder({ customerId: req.user.id, shippingAddress: shippingAddress.trim(), phoneNumber: phoneNumber.trim(), items: normalizedItems });
    return res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    const status = /stock|available|medicine/i.test(error?.message || "") ? 409 : 400;
    return res.status(status).json({ success: false, message: error?.message || "Order creation failed." });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const orders = await ordersService.getMyOrders(req.user.id);
    return res.status(200).json({ success: true, data: orders });
  } catch (error: any) { return res.status(500).json({ success: false, message: error.message }); }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ success: false, message: "Invalid order ID." });
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const order = await ordersService.getOrderById(id, req.user.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    return res.status(200).json({ success: true, data: order });
  } catch (error: any) { return res.status(500).json({ success: false, message: error.message }); }
};

const getSellerOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const orders = await ordersService.getSellerOrders(req.user.id, req.user.role === "ADMIN");
    return res.status(200).json({ success: true, data: orders });
  } catch (error: any) { return res.status(500).json({ success: false, message: error.message }); }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    const status = req.body?.status as OrderStatus;
    if (!id) return res.status(400).json({ success: false, message: "Invalid order ID." });
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!Object.values(OrderStatus).includes(status)) return res.status(400).json({ success: false, message: "Invalid order status." });
    const order = await ordersService.updateOrderStatus(id, req.user.id, status, req.user.role === "ADMIN");
    return res.status(200).json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (error: any) { return res.status(404).json({ success: false, message: error.message }); }
};

export const ordersController = { createOrder, getMyOrders, getOrderById, getSellerOrders, updateOrderStatus };
