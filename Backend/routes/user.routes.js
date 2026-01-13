import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { RegisterUser, LoginUser, logout } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", verifyJWT, logout);


export default router;