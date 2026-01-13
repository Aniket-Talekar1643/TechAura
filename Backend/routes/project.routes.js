import express from "express";
import {
    createProject,
    deleteProject,
    updateProject,
    getAllProjects
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CREATE project
router.post("/", verifyJWT, createProject);

// GET all projects
router.get("/", verifyJWT, getAllProjects);

// UPDATE project
router.put("/:id", verifyJWT, updateProject);

// DELETE project
router.delete("/:id", verifyJWT, deleteProject);

export default router;
