import { Request, Response, NextFunction } from "express";
import { medicinesService } from "./medicine.service";

const createMedicine = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const medicine = await medicinesService.createMedicine(req.body, req.user.id);
    return res.status(201).json({ success: true, data: medicine });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || "Medicine creation failed." });
  }
};

const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const result = await medicinesService.getAllMedicines(req.query);
    return res.status(200).json({ success: true, message: "Medicines fetched successfully", data: result.data, meta: result.meta });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

const getMedicineById = async (req: Request, res: Response) => {
  try {
    const medicine = await medicinesService.getMedicineById(String(req.params.id || ""));
    if (!medicine || !medicine.isActive) return res.status(404).json({ success: false, message: "Medicine not found" });
    return res.status(200).json({ success: true, data: medicine });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id || "");
    if (!id || !req.user) return res.status(400).json({ success: false, message: "Invalid medicine ID." });
    const result = await medicinesService.updateMedicine(id, req.body, req.user.id, req.user.role === "ADMIN");
    return res.status(200).json({ success: true, data: result, message: "Medicine updated successfully." });
  } catch (error) {
    return next(error);
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ success: false, message: "Invalid medicine ID." });
    const result = await medicinesService.deleteMedicine(id, req.user.id, req.user.role === "ADMIN");
    return res.status(200).json({ success: true, message: "Medicine removed successfully", data: result });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const medicinesController = { createMedicine, getAllMedicines, getMedicineById, updateMedicine, deleteMedicine };
