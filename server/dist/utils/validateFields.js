"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisterFields = validateRegisterFields;
exports.validateLoginFields = validateLoginFields;
exports.isValidEmail = isValidEmail;
exports.isValidPassword = isValidPassword;
function validateRegisterFields({ fullName, email, password, }) {
    if (!fullName || !email || !password) {
        return {
            message: "Missing required fields",
            error: "Full name, email, and password are required",
        };
    }
    return null;
}
function validateLoginFields({ email, password, }) {
    if (!email || !password) {
        return {
            message: "Missing required fields",
            error: "Email and password are required",
        };
    }
    return null;
}
function isValidEmail({ email }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            message: "Invalid email format",
            error: "Please provide a valid email address",
        };
    }
    return null;
}
function isValidPassword({ password }) {
    console.log(password);
    if (!password || password.length < 6 || password.length > 32) {
        return {
            message: `Invalid password length, ${password.length}`,
            error: "Password must be between 6 and 32 characters long",
        };
    }
    return null;
}
//# sourceMappingURL=validateFields.js.map