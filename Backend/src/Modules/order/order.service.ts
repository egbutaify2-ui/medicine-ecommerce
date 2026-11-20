import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type NewOrder = { customerId: string; shippingAddress: string; phoneNumber: string; items: { medicineId: string; quantity: number }[] };

const createOrder = async (data: NewOrder) => prisma.$transaction(async (transaction) => {
  const quantities = new Map<string, number>();
  for (const item of data.items) quantities.set(item.medicineId, (quantities.get(item.medicineId) || 0) + item.quantity);
  const medicineIds = [...quantities.keys()];
  const medicines = await transaction.medicine.findMany({ where: { id: { in: medicineIds }, isActive: true } });
  if (medicines.length !== medicineIds.length) throw new Error("One or more products are unavailable.");

  const medicineById = new Map(medicines.map((medicine) => [medicine.id, medicine]));
  const orderItems: { medicineId: string; sellerId: string; quantity: number; price: number }[] = [];
  let totalAmount = 0;

  for (const [medicineId, quantity] of quantities.entries()) {
    const medicine = medicineById.get(medicineId);
    if (!medicine) throw new Error("Product is unavailable.");
    if (medicine.stock < quantity) throw new Error(`Not enough stock for ${medicine.name}.`);
    const reserved = await transaction.medicine.updateMany({
      where: { id: medicineId, isActive: true, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });
    if (reserved.count !== 1) throw new Error(`Stock changed before ${medicine.name} could be reserved. Please try again.`);
    totalAmount += medicine.price * quantity;
    orderItems.push({ medicineId, sellerId: medicine.authorId, quantity, price: medicine.price });
  }

  return transaction.order.create({
    data: {
      customerId: data.customerId,
      shippingAddress: data.shippingAddress,
      phoneNumber: data.phoneNumber,
      totalAmount,
      status: OrderStatus.PLACED,
      orderItems: { create: orderItems },
    },
    include: { orderItems: { include: { medicine: true } } },
  });
});

const getMyOrders = async (customerId: string) => prisma.order.findMany({
  where: { customerId },
  include: { orderItems: { include: { medicine: true } } },
  orderBy: { createdAt: "desc" },
});

const getOrderById = async (orderId: string, userId: string) => prisma.order.findFirst({
  where: { id: orderId, customerId: userId },
  include: { orderItems: { include: { medicine: true } } },
});

const getSellerOrders = async (sellerId: string, isAdmin = false) => prisma.order.findMany({
  where: isAdmin ? {} : { orderItems: { some: { sellerId } } },
  include: { orderItems: { where: isAdmin ? undefined : { sellerId }, include: { medicine: true } } },
  orderBy: { createdAt: "desc" },
});

const updateOrderStatus = async (orderId: string, sellerId: string, status: OrderStatus, isAdmin = false) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, ...(isAdmin ? {} : { orderItems: { some: { sellerId } } }) },
    select: { id: true },
  });
  if (!order) throw new Error("Order not found or not assigned to this seller.");
  return prisma.order.update({ where: { id: orderId }, data: { status } });
};

export const ordersService = { createOrder, getMyOrders, getOrderById, getSellerOrders, updateOrderStatus };
