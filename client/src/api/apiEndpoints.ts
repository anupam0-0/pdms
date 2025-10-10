export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export const CHECK_HEALTH = '/health'

// * Auth
export const REGISTER_PATH = "/auth/register"
export const LOGIN_PATH = "/auth/login"
export const LOGOUT_PATH = "/auth/logout"
export const GETME_PATH = "/auth/profile"