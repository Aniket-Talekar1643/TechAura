import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({

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
    description: {
        type: String,
        required: true
    },
   
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},
    { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;