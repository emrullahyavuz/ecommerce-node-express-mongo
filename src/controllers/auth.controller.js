const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateTokens } = require("../utils/tokenUtils");
const jwtConfig = require("../config/jwt.config");

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
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/"
        };

        res.cookie("accessToken", tokens.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ user, tokens });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

const logout = async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/"
    };
    
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.json({ message: "Logged out successfully" });
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
   
    console.log("Received refresh token:", refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, jwtConfig.refreshToken.secret);
        console.log("Decoded token:", decoded);
        const user = await User.findById(decoded.id);
        console.log("Found user:", user);

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const tokens = generateTokens(user);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/"
        };
        
        res.cookie("accessToken", tokens.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ tokens });
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};

module.exports = { register, login, logout, refreshToken };

