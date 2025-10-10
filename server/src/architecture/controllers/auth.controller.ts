import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../services/auth.service";
import { comparePassword } from "../../utils/hashPassword";
import { setAuthCookie, clearAuthCookie } from "../../utils/cookieUtils";
import {
  isValidEmail,
  isValidPassword,
  validateLoginFields,
  validateRegisterFields,
} from "../../utils/validateFields";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const {fullName, email, password } = req.body;

    // Validate required fields using a service function
    const missingFieldsError = validateRegisterFields({
      fullName,
      email,
      password,
    });
    if (missingFieldsError) {
      res.status(400).json(missingFieldsError);
      return;
    }

    // Validate email format using a util function
    // const validEmailError = isValidEmail(email);
    // if (validEmailError) {
    //   res.status(400).json(validEmailError);
    //   return;
    // }

    // Validate password length using a util function
    const validPasswordError = isValidPassword({password});
    if (validPasswordError) {
      res.status(400).json(validPasswordError);
      return;
    }

    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await userService.createUser(fullName, email, password);

    // Generate JWT token
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Set cookie
    setAuthCookie(res, token);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.fullName, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validate required fields
    const missingFieldsError = validateLoginFields({ email, password });
    if (missingFieldsError) {
      res.status(400).json(missingFieldsError);
      return;
    }

    // // Basic email validation
    // const validEmailError = isValidEmail(email);
    // if (validEmailError) {
    //   res.status(400).json(validEmailError);
    //   return;
    // }

    // Find user by email
    const user = await userService.findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        message: "Invalid credentials: User not found. Pls register first",
      });
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: "Invalid credentials: Password didn't match" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Set cookie
    setAuthCookie(res, token);

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.fullName, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    clearAuthCookie(res);
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    // console.log(user);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
	// console.log(user);
    res.json({
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
