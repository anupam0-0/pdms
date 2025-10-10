"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.getProfile = getProfile;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService = __importStar(require("../services/auth.service"));
const hashPassword_1 = require("../../utils/hashPassword");
const cookieUtils_1 = require("../../utils/cookieUtils");
const validateFields_1 = require("../../utils/validateFields");
async function register(req, res) {
    try {
        const { fullName, email, password } = req.body;
        const missingFieldsError = (0, validateFields_1.validateRegisterFields)({
            fullName,
            email,
            password,
        });
        if (missingFieldsError) {
            res.status(400).json(missingFieldsError);
            return;
        }
        const validPasswordError = (0, validateFields_1.isValidPassword)({ password });
        if (validPasswordError) {
            res.status(400).json(validPasswordError);
            return;
        }
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const user = await userService.createUser(fullName, email, password);
        const token = jsonwebtoken_1.default.sign({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" });
        (0, cookieUtils_1.setAuthCookie)(res, token);
        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, name: user.fullName, role: user.role },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const missingFieldsError = (0, validateFields_1.validateLoginFields)({ email, password });
        if (missingFieldsError) {
            res.status(400).json(missingFieldsError);
            return;
        }
        const user = await userService.findUserByEmail(email);
        if (!user) {
            res.status(401).json({
                message: "Invalid credentials: User not found. Pls register first",
            });
            return;
        }
        const isPasswordValid = await (0, hashPassword_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            res
                .status(401)
                .json({ message: "Invalid credentials: Password didn't match" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" });
        (0, cookieUtils_1.setAuthCookie)(res, token);
        res.json({
            message: "Login successful",
            user: { id: user._id, name: user.fullName, role: user.role },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
async function logout(req, res) {
    try {
        (0, cookieUtils_1.clearAuthCookie)(res);
        res.json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
async function getProfile(req, res) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        res.json({
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
//# sourceMappingURL=auth.controller.js.map