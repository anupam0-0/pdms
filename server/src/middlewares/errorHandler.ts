import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);

    // Handle JSON parsing errors
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
        return res.status(400).json({ 
            message: "Invalid JSON format in request body",
            error: "Please ensure your request body contains valid JSON"
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: "Validation error",
            error: err.message 
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
            message: "Invalid token",
            error: "Please provide a valid authentication token"
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
            message: "Token expired",
            error: "Please login again"
        });
    }

    // Default error response
    return res.status(err.status || 500).json({ 
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};