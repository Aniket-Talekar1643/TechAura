import Blog from '../models/blogs.models.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^a-zA-Z0-9\-]/g, "");
};

export const CreateBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        // Validation
        if (!title || title.length < 20) {
            return res.status(400).json({
                message: "Title must be at least 20 characters long"
            });
        }

        console.log(title);

        const slug = createSlug(title);

        // Get image path from multer
        const blogpath = req.file?.path;
        console.log(blogpath);

        if (!blogpath) {
            return res.status(400).json({ message: "Blog image is required" });
        }

        // Upload to Cloudinary
        const uploadBlogOnCloudinary = await uploadOnCloudinary(blogpath);
        console.log(uploadBlogOnCloudinary);

        if (!uploadBlogOnCloudinary?.url) {
            return res.status(400).json({ message: "Failed to upload on Cloudinary" });
        }

        // Author from authentication
        const author = req.user?._id;
        if (!author) {
            return res.status(400).json({
                message: "Author information missing. Login required."
            });
        }

        // Save blog
        const blog = await Blog.create({
            title,
            content,
            category,
            thumbnail: uploadBlogOnCloudinary.url,
            slug,
            author
        });

        return res.status(201).json({
            message: "Blog Created Successfully",
            blog
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to Create Blog" });
    }
};
