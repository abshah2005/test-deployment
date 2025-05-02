import express from "express";
import {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
} from "../Controllers/ReviewController.js";
import {
  verifyJWT,
  verifyAdmin,
} from "../middlewares/Authentication.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createReview);
router.get("/", getAllReviews);
router.put("/:id", verifyJWT, updateReview);
router.delete("/:id", verifyJWT, deleteReview);

export default router;
