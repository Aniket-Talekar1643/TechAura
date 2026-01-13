import slugify from 'slugify';
import Project from '../models/project.models.js';
const createSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
};

export const createProject = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || title.length < 20) {
            return res.status(400).json({
                message: "Title must be at least 20 characters long",
            });
        }

        if (!req.user?._id) {
            return res.status(401).json({ message: "Login required" });
        }

        const slug = createSlug(title);

        const project = await Project.create({
            title,
            description,
            slug,
            author: req.user._id,
        });

        return res.status(201).json({
            message: "Project Created Successfully",
            project,
        });

    } catch (err) {
        console.error("CREATE PROJECT ERROR 👉", err);

        if (err.code === 11000) {
            return res.status(400).json({
                message: "Project title already exists",
            });
        }

        return res.status(500).json({
            message: "Failed to Create Project",
        });
    }
};


export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("author", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: projects.length,
            projects,
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch projects" });
    }
};
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // author check
        if (project.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not allowed to update this project",
            });
        }

        if (title) {
            project.title = title;
            project.slug = createSlug(title);
        }

        if (description) {
            project.description = description;
        }

        await project.save();

        return res.status(200).json({
            message: "Project Updated Successfully",
            project,
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update project" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not allowed to delete this project",
            });
        }

        await Project.findByIdAndDelete(id);

        return res.status(200).json({ message: "Project Deleted Successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete project" });
    }
};

