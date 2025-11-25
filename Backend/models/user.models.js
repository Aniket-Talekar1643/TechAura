import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    // profilePicture: {
    //     type: String,
    //     required: true,
    // },
    about: {
        type: String,
        default: "",
    },
    refreshToken: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
);
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            mail: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);

export default User;
