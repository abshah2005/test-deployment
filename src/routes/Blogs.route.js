import express from "express";
import { createBlog, getAllBlogs,getBlogById,deleteBlog,updateBlog } from "../Controllers/BlogController.js";
import {
  verifyAdmin,
  verifyJWT,
} from "../middlewares/Authentication.middleware.js";
import { upload } from "../middlewares/Multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    upload.fields([{ name: "images", maxCount: 6 }]),
    verifyJWT,
    verifyAdmin,
    createBlog
  );

router.get("/", getAllBlogs);

router.get("/:id", getBlogById);

router.put(
  "/:id",
  verifyJWT,
  verifyAdmin,
  upload.fields([{ name: "images", maxCount: 6 }]),
  updateBlog
);

router.delete("/:id", verifyJWT, verifyAdmin, deleteBlog);

export default router;
