import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log(user);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // console.log(accessToken, refreshToken);

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false
        });
        return { accessToken, refreshToken };
    } catch (err) {

        throw new Error("something went wrong while generating refresh or access token");


    }
}
export const RegisterUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // username validation
        if (!username || username.length < 3) {
            return res
                .status(400)
                .json({ message: "Username must be at least 3 characters" });
        }

        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // password validation
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be 6+ chars, include 1 number & 1 special character",
            });
        }

        // role validation
        if (!role) {
            return res.status(400).json({ message: "Role is required" });
        }

        // check user exists
        const exitUser = await User.findOne({ email });
        if (exitUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ DO NOT hash here (model will handle it)
        const newUser = new User({
            username,
            email,
            password, // 🔥 plain password
            role,
        });

        await newUser.save(); // 🔐 pre-save hook hashes password

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Registration Failed", error: err.message });
    }
};


export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password Required" });
        }

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        // generate tokens
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id);

        // cookie options (LOCALHOST SAFE)
        const options = {
            httpOnly: true,
            secure: false,       // ❗ localhost
            sameSite: "lax",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Login Successful",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Login Failed",
            error: err.message,
        });
    }
};

export const logout = async (req, res) => {
    //first check user is logged in or not 
    // then remove refresh token from database
    // then clear the cookie
    try {
        const loggedInUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { refreshToken: undefined }
            },
            { new: true }
        );
        const options = {
            httpOnly: true,
            secure: true

        };
        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User Logged Out" });
    }
    catch (err) {
        res.status(400).json({ message: "Logout Failed" });
    }
}

