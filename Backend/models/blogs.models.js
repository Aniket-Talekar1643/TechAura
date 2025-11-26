import mongoose from "mongoose";

const BlogsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        default: "General"

    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

},
    { timestamps: true }
);

 const Blog = mongoose.model("Blog", BlogsSchema);

 export default Blog;