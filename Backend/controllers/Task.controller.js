import Task from "../models/Task.models.js";
import Project from "../models/project.models.js";

/**
 * CREATE TASK
 * POST /api/projects/:projectId/tasks
 */
export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        const { projectId } = req.params;

        if (!title) {
            return res.status(400).json({ message: "Task title is required" });
        }

        // check project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            project: projectId,
            createdBy: req.user._id,
        });

        res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
};

/**
 * GET TASKS BY PROJECT
 * GET /api/projects/:projectId/tasks
 */
export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await Task.find({ project: projectId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

/**
 * UPDATE TASK
 * PUT /api/tasks/:taskId
 */
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status, priority } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // only creator can update
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
};

/**
 * DELETE TASK
 * DELETE /api/tasks/:taskId
 */
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};

