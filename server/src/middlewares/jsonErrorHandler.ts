import { Request, Response, NextFunction } from "express";

export const jsonErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    // Handle JSON parsing errors specifically
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
        console.error("JSON Parsing Error:", err.message);
        res.status(400).json({
            message: "Invalid JSON format",
            error: "The request body contains invalid JSON. Please check your request format.",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
        return;
    }
    
    // If it's not a JSON error, pass it to the next error handler
    next(err);
};
