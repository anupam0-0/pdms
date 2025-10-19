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
import {
  sendCreated,
  sendSuccess,
  sendBadRequest,
  sendUnauthorized,
  sendServerError,
} from "../../utils/responseHelper";
import User from "../models/User";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, email, password } = req.body;
    console.log("1:", req.body);

    // Validate required fields using a service function
    const missingFieldsError = validateRegisterFields({
      fullName,
      email,
      password,
    });
    if (missingFieldsError) {
      sendBadRequest(res, missingFieldsError.message, missingFieldsError.error);
      return;
    }

    // Validate email format using a util function
    // const validEmailError = isValidEmail(email);
    // if (validEmailError) {
    //   res.status(400).json(validEmailError);
    //   return;
    // }

    // Validate password length using a util function
    const validPasswordError = isValidPassword({ password });
    if (validPasswordError) {
      sendBadRequest(res, validPasswordError.message, validPasswordError.error);
      return;
    }

    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      sendBadRequest(res, "User already exists", "UserExistsError");
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

    sendCreated(res, "User registered successfully", {
      userId: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Registration error:", error);
    sendServerError(
      res,
      "Something went wrong, please try again later",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    // Validate required fields
    const missingFieldsError = validateLoginFields({ email, password });
    if (missingFieldsError) {
      sendBadRequest(res, missingFieldsError.message, missingFieldsError.error);
      if (process.env.NODE_ENV === "development") {
        console.error("Invalid credentials: Missing Field ");
      }
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
      sendUnauthorized(
        res,
        "Invalid credentials: User not found. Please register first",
        "UserNotFoundError"
      );
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Invalid credentials: User not found. Pls register first "
        );
      }
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      sendUnauthorized(
        res,
        "Invalid credentials: Password didn't match",
        "InvalidPasswordError"
      );
      if (process.env.NODE_ENV === "development") {
        console.error("Invalid credentials: Password didn't match");
      }
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

    sendSuccess(res, "Login successful", {
      userId: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    sendServerError(
      res,
      "Something went wrong, please try again later",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    clearAuthCookie(res);
    sendSuccess(res, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    sendServerError(
      res,
      "Something went wrong, please try again later",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    // console.log(user);
    if (!user) {
      sendUnauthorized(res, "User not found", "UserNotFoundError");
      return;
    }
    // console.log(user);
    sendSuccess(res, "User profile fetched successfully", {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    sendServerError(
      res,
      "Something went wrong, please try again later",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    const profile = await User.findById(user?.id).select("-password");
    // console.log(user);
    if (!user) {
      sendUnauthorized(res, "User not found", "UserNotFoundError");
      return;
    }
    // console.log(user);
    sendSuccess(res, "User profile fetched successfully", {
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    sendServerError(
      res,
      "Something went wrong, please try again later",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
