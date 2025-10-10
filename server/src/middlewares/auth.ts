import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../architecture/models/User";

// Extend Request interface to include user
declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		// Only get token from cookie, not from Authorization header
		const token = req.cookies.token;

		if (!token) {
			res.status(401).json({ message: "No token, authorization denied" });
			return;
		}

		if (!process.env.JWT_SECRET) {
			res.status(500).json({ message: "JWT secret not configured" });
			return;
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
		// console.log("Token", token)
		// console.log("Decoded", decoded)
		req.user = decoded.user;
		// console.log(req.user)
		next();
	} catch (error) {
		res.status(401).json({ message: "Token is not valid" });
	}
};

