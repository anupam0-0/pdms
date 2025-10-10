"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonErrorHandler = void 0;
const jsonErrorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
        console.error("JSON Parsing Error:", err.message);
        res.status(400).json({
            message: "Invalid JSON format",
            error: "The request body contains invalid JSON. Please check your request format.",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
        return;
    }
    next(err);
};
exports.jsonErrorHandler = jsonErrorHandler;
//# sourceMappingURL=jsonErrorHandler.js.map