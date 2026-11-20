import { Medicine, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "authorId">,
  sellerId: string
) => prisma.medicine.create({ data: { ...data, authorId: sellerId } });

const updateMedicine = async (
  id: string,
  data: Partial<Omit<Medicine, "id" | "authorId" | "createdAt" | "updatedAt">>,
  sellerId: string,
  isAdmin = false
) => {
  const where = { id, ...(isAdmin ? {} : { authorId: sellerId }) };
  const existing = await prisma.medicine.findFirst({ where, select: { id: true } });
  if (!existing) throw new Error("Medicine not found or not owned by this seller.");
  return prisma.medicine.update({ where: { id }, data });
};

const getAllMedicines = async (query: any) => {
  const { search, categoryId, minPrice, maxPrice, page = 1, limit = 9 } = query;
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(48, Math.max(1, Number(limit) || 9));
  const where: Prisma.MedicineWhereInput = { isActive: true };
  if (search) where.name = { contains: String(search), mode: "insensitive" };
  if (categoryId) where.categoryId = String(categoryId);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && minPrice !== "") where.price.gte = Math.max(0, Number(minPrice));
    if (maxPrice !== undefined && maxPrice !== "") where.price.lte = Math.max(0, Number(maxPrice));
  }
  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({ where, skip: (pageNumber - 1) * limitNumber, take: limitNumber, include: { category: true, reviews: true }, orderBy: { createdAt: "desc" } }),
    prisma.medicine.count({ where }),
  ]);
  return { data: medicines, meta: { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber) } };
};

const getMedicineById = async (id: string) => prisma.medicine.findUnique({ where: { id }, include: { category: true, reviews: true } });

const deleteMedicine = async (id: string, sellerId: string, isAdmin = false) => {
  const where = { id, ...(isAdmin ? {} : { authorId: sellerId }) };
  const existing = await prisma.medicine.findFirst({ where, select: { id: true } });
  if (!existing) throw new Error("Medicine not found or not owned by this seller.");
  return prisma.medicine.update({ where: { id }, data: { isActive: false } });
};

export const medicinesService = { createMedicine, getAllMedicines, updateMedicine, getMedicineById, deleteMedicine };
