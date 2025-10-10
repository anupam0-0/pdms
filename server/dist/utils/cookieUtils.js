"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieConfig = exports.clearCustomCookie = exports.setCustomCookie = exports.clearAuthCookie = exports.setAuthCookie = void 0;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const setAuthCookie = (res, token) => {
    res.cookie("token", token, COOKIE_OPTIONS);
};
exports.setAuthCookie = setAuthCookie;
const clearAuthCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
};
exports.clearAuthCookie = clearAuthCookie;
const setCustomCookie = (res, name, value, options) => {
    const cookieOptions = { ...COOKIE_OPTIONS, ...options };
    res.cookie(name, value, cookieOptions);
};
exports.setCustomCookie = setCustomCookie;
const clearCustomCookie = (res, name, options) => {
    const clearOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        ...options,
    };
    res.clearCookie(name, clearOptions);
};
exports.clearCustomCookie = clearCustomCookie;
const getCookieConfig = () => ({ ...COOKIE_OPTIONS });
exports.getCookieConfig = getCookieConfig;
//# sourceMappingURL=cookieUtils.js.map