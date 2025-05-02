import express from "express";
import {
  submitContact,
  getContacts,
  respondToContact,
  
} from "../Controllers/ContactController.js";
import { verifyAdmin,verifyJWT } from "../middlewares/Authentication.middleware.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", verifyAdmin,verifyJWT, getContacts);
router.put("/:id/respond", verifyAdmin,verifyJWT, respondToContact);


export default router;
