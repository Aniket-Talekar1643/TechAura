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
        const { username, email, password, about } = req.body;

        // console.log(username, email, about, password);

        // username validation
        if (!username || username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters" });
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
                message: "Password must be 6+ chars, include 1 number & 1 special character"
            });
        }

        // about validation
        if (!about) {
            return res.status(400).json({ message: "About must" });
        }

        // check user exists
        const exitUser = await User.findOne({ email });
        if (exitUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);
        // console.log(hashPassword)
        // create new user
        const newUser = new User({
            username,
            email,
            password: hashPassword,
            about
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: "Registration Failed", error: err.message });
    }
};

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password Required" });
        }

        // check user exists
        const userExit = await User.findOne({ email });
        if (!userExit) {
            return res.status(400).json({ message: "User not Found" });
        }

        // compare password
        const isPasswordCorrect = await bcrypt.compare(password, userExit.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        //generating tokens here for that user
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExit._id);

        const options = {
            httpOnly: true,
            secure: true
        }


        // success response
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Login Successful",
                user: {
                    id: userExit._id,
                    username: userExit.username,
                    email: userExit.email,
                },
            });


    } catch (err) {
        res.status(500).json({ message: "Login Failed", error: err.message });
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

export const profile = async (req, res) => {
    try {
        const user = req.user._id;
        //console.log("user",user);
        const ExitUser = await User.findById(user._id);

        if (!ExitUser) {
            return res.status(400).json({ message: "User not found" });
        }
        // console.log(ExitUser);

        return res.status(200).json({
            message: "profile fetched succssfully",
            user: {
                id: ExitUser._id,
                email: ExitUser.email,
                username: ExitUser.username,
                about: ExitUser.about,
                createdDate: ExitUser.createAt
            }

        })

    } catch (err) {
        return res.status(400).json({ message: "failed to fetch profile" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { username, email, about } = req.body;

        //take provided feild 
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (about) updateData.about = about;

        // cheack user provide or not update for feild
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No field provided to update" })
        }

        //check also new also have unique mail id 
        if (email) {
            const UserExit = await User.findOne({ email })

            if (UserExit) {
                return res.ststus(200).json({ message: "Email already in use" })
            }
        }
        //check also new also have unique mail id 
        if (username) {
            const UserExit = await User.findOne({ username })

            if (UserExit) {
                return res.ststus(200).json({ message: "username already in use" })
            }
        }
        const updateUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: updateData
            },
            {
                new: true
            }
        )
        return res.status(200).json({ message: "Profile updated Successfully" })
    }
    catch (err) {
        return res.status(400).json({ message: "failed to update" })
    }
}