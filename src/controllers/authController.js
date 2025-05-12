const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { generateTokens, verifyAccessToken, verifyRefreshToken } = require("../utils/tokenUtils");
const jwtConfig = require("../config/jwt.config");
const { AppError, logger } = require("../middleware/errorHandler");


// Register a new user
const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new AppError("User already exists", 400);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ username, email, password: hashedPassword });
        
        const tokens = generateTokens(user);
        res.status(201).json({ user, tokens });
    } catch (error) {
        next(error);
    }
};

// Login a user
const login = async (req, res, next) => {
    

    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });
        logger.info(`Login attempt for user: ${username}`);
        
        if (!user) {
            throw new AppError("Invalid username or password", 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError("Invalid username or password", 401);
        }
        await RefreshToken.deleteMany({ userId: user._id });


        const tokens = generateTokens(user);
        await RefreshToken.create({
            token: tokens.refreshToken,
            userId: user._id
        });
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

        logger.info(`User ${username} logged in successfully`);
        res.json({ user, tokens });
    } catch (error) {
        next(error);
    }
};

// Logout a user
const logout = async (req, res, next) => {
    try {

        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await RefreshToken.deleteMany({ token: refreshToken });
        }
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/"
        };

        
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
        
        logger.info(`User ${req.user?.username || 'unknown'} logged out`);
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};

// Refresh a user's token
const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;
   
    logger.info("Refresh token request received");

    if (!refreshToken) {
        throw new AppError("Refresh token is required", 401);
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        logger.info(`Token decoded for user ID: ${decoded.id}`);
        
        const user = await User.findById(decoded.id);
        logger.info(`User found: ${user ? user.username : 'not found'}`);

        if (!user) {
            throw new AppError("Invalid refresh token", 401);
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

        logger.info(`Tokens refreshed for user: ${user.username}`);
        res.json({ tokens });
    } catch (error) {
        logger.error("Refresh token error:", error);
        next(error);
    }
};

module.exports = { register, login, logout, refreshToken };

