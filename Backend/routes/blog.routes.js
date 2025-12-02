import express from "express"
import { createBlog, deleteblog, getAllBlogs, getblogbyslug } from "../controllers/blogs.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, upload.single("thumbnail"), createBlog);
router.get("/getallblogs",verifyJWT,getAllBlogs);
router.get("/getblogbyslug/:slug", verifyJWT, getblogbyslug);
router.delete("/deleteblog",verifyJWT,deleteblog);

export default router;