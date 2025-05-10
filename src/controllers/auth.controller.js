const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateTokens } = require("../utils/tokenUtils");

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ username, email, password: hashedPassword });
        
        const tokens = generateTokens(user);
        res.status(201).json({ user, tokens });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        console.log(user)
        
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const tokens = generateTokens(user);
        res.json({ user, tokens });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

const logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };

