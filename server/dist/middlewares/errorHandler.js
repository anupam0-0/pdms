"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
        return res.status(400).json({
            message: "Invalid JSON format in request body",
            error: "Please ensure your request body contains valid JSON"
        });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: "Validation error",
            error: err.message
        });
    }
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
    return res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map