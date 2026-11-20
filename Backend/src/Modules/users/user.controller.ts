import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUser = async (_req: Request, res: Response) => {
  try { const data = await userServices.getUser(); return res.status(200).json({ success: true, message: "Users retrieved successfully", data }); }
  catch (error: any) { return res.status(500).json({ success: false, message: error.message }); }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user.role !== "ADMIN" && req.user.id !== id) return res.status(403).json({ success: false, message: "You can only view your own account." });
    const data = await userServices.getSingleUser(id);
    if (!data) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, message: "User fetched successfully", data });
  } catch (error: any) { return res.status(500).json({ success: false, message: error.message }); }
};

const putSingleUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const isAdmin = req.user.role === "ADMIN";
    if (!isAdmin && req.user.id !== id) return res.status(403).json({ success: false, message: "You can only update your own account." });
    const payload = isAdmin ? req.body : { name: req.body?.name, phone: req.body?.phone, image: req.body?.image };
    const data = await userServices.putSingleUser(id, payload);
    return res.status(200).json({ success: true, message: "User updated successfully", data });
  } catch (error: any) { return res.status(error.code === "P2025" ? 404 : 400).json({ success: false, message: error.message }); }
};

const deleteSingleUser = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "ADMIN") return res.status(403).json({ success: false, message: "Only an administrator can delete user accounts." });
    const data = await userServices.deleteSingleUser(String(req.params.id || ""));
    return res.status(200).json({ success: true, message: "User deleted successfully", data });
  } catch (error: any) { return res.status(error.code === "P2025" ? 404 : 400).json({ success: false, message: error.message }); }
};

export const userControllers = { getUser, getSingleUser, putSingleUser, deleteSingleUser };
