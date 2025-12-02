import slugify from 'slugify';
import Blog from '../models/blogs.models.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^a-zA-Z0-9\-]/g, "");
};

export const createBlog = async (req, res) => {
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

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 })

        if (blogs.length === 0) {
            return res.status(400).json({ message: "empty" });
        }

        return res.status(200).json(
            {
                message: "Blog fetched Successfully",

                blogs
            }
        )
    } catch (err) {
        return res.status(400).json({ message: "failed to fetched blogs" });
    }
}
export const getblogbyslug = async (req, res) => {
    try {
        const { slug } = req.params;
        console.log(slug);

        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(400).json({ message: "Blog not Found" })
        }

        return res.status(200).json({
            message: "Blog fetched",
            blog
        })
    } catch (err) {
        return res.status(400).json({ message: "failed to fetched" })
    }
}
export const deleteblog = async () => {
    
    try {
        const { id } = req.params

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(400).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: "Not allowed to delete this blog" })
        }
        await Blog.findByIdAndDelete(id);
        
        return res.status(200).json({ message: "Blog Deleted Successfully" });

    } catch (err) {
        return res.status(400).json({ message: "Failed" });
    }
}
