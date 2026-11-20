import { Request, Response } from "express";
import { reviewService } from "./review.server";

const createReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { medicineId, rating, comment } = req.body ?? {};
    const numericRating = Number(rating);
    if (!medicineId || !comment?.trim() || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Medicine ID, a 1–5 rating and a comment are required." });
    }
    const review = await reviewService.createReview({ customerId: req.user.id, medicineId, rating: numericRating, comment: comment.trim() });
    return res.status(201).json({ success: true, data: review });
  } catch (error: any) { return res.status(400).json({ success: false, message: error.message }); }
};

const getReviewById = async (req: Request, res: Response) => {
  try {
    const result = await reviewService.getReviewById(String(req.params.reviewId || ""));
    if (!result) return res.status(404).json({ success: false, message: "Review not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) { return res.status(400).json({ success: false, message: error.message }); }
};

const getReviewsByAuthor = async (req: Request, res: Response) => {
  try {
    const customerId = String(req.params.customerId || "");
    if (!customerId) return res.status(400).json({ success: false, message: "Customer ID is required" });
    const data = await reviewService.getReviewsByAuthor(customerId);
    return res.status(200).json({ success: true, data });
  } catch (error: any) { return res.status(500).json({ success: false, message: error.message }); }
};

export const reviewController = { createReview, getReviewById, getReviewsByAuthor };
