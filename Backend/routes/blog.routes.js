import express from "express"
import { CreateBlog } from "../controllers/blogs.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, upload.single("thumbnail"), CreateBlog);


export default router;