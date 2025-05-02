import express from "express";
import {
  verifyJWT,
  verifyAdmin,
} from "../middlewares/Authentication.middleware.js";
import {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  searchTours,
} from "../Controllers/TourController.js";
import { upload } from "../middlewares/Multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    upload.fields([{ name: "images", maxCount: 6 }]),
    verifyJWT,
    verifyAdmin,
    createTour
  );

router.get("/", getAllTours);
router.get("/:id", getTourById);
router.put("/:id", verifyJWT, verifyAdmin, updateTour);
router.delete("/:id", verifyJWT, verifyAdmin, deleteTour);
router.get("/filterToure",searchTours)

export default router;
