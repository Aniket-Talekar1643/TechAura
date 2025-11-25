import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { RegisterUser, LoginUser, logout, profile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/register", RegisterUser);
router.get("/login", LoginUser);
router.post("/logout", verifyJWT, logout);
router.get("/profile", verifyJWT, profile);
router.put("/updateProfile", verifyJWT, updateProfile);

export default router;