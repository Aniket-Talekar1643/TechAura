import express from "express";
import {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    
} from "../controllers/Task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// project-wise
router.post("/projects/:projectId/tasks", verifyJWT, createTask);
router.get("/projects/:projectId/tasks", verifyJWT, getTasksByProject);

// task-wise
router.put("/tasks/:taskId", verifyJWT, updateTask);
router.delete("/tasks/:taskId", verifyJWT, deleteTask);


export default router;
