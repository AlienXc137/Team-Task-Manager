import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    //Check for missing fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    //Validate Email Format using a Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    //Validate Password Strength
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role: role || "member" // Fallback in case role isn't provided
        });

        // Don't send the password hash back to the client
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "Invalid email or password." }); // Generic error for security

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: "Invalid email or password." }); // Generic error for security

    const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name }, // Added name to token payload for UI convenience
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
};