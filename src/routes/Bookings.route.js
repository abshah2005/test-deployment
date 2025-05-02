import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
 
} from "../Controllers/BookingController.js";
import { verifyJWT,verifyAdmin } from "../middlewares/Authentication.middleware.js";

const router = express.Router();

router.post("/", verifyJWT,createBooking);
router.get("/", verifyJWT,verifyAdmin, getAllBookings);
router.get("/userBookings", verifyJWT, getUserBookings);
router.put("/:id", verifyJWT,verifyAdmin, updateBookingStatus);

export default router;
