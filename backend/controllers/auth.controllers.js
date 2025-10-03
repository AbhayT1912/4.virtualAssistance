import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = await genToken(newUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
        });

        res.status(201).json(newUser)


    } catch (error) {
        return res.status(500).json({ message: `Sign up failed ${error}` });
    }


}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if user already exists
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ message: "email does not exist!" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = await genToken(userExists._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
        });

        res.status(200).json(userExists)


    } catch (error) {
        return res.status(500).json({ message: `Login failed ${error}` });
    }


}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
            const userId = verifyToken.id;
            await User.findByIdAndUpdate(userId, { assistantName: null, assistantImage: null });
        }

        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        // if token is invalid or expired, it will throw an error.
        // In that case, we still want to clear the cookie.
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    }
}
