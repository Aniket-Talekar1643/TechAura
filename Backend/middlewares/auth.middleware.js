import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async function (req, res, next) {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        // console.log("token", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decodedToken)

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
        // console.log(user);
        if (!user) {
            return res.status(401).json({ message: "Invalid access token" });
        }

        req.user = user; // store logged-in user info
        next();
    } catch (err) {
        return res.status(401).json({ message: err?.message || "Invalid access token" });
    }
};
