import { Response } from "express";

/**
 * Cookie configuration options
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

/**
 * Sets an authentication token cookie
 * @param res - Express response object
 * @param token - JWT token to set
 */
export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie("token", token, COOKIE_OPTIONS);
};

/**
 * Clears the authentication token cookie
 * @param res - Express response object
 */
export const clearAuthCookie = (res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};

/**
 * Sets a custom cookie with provided options
 * @param res - Express response object
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Optional cookie options (will merge with defaults)
 */
export const setCustomCookie = (
  res: Response,
  name: string,
  value: string,
  options?: Partial<typeof COOKIE_OPTIONS>
): void => {
  const cookieOptions = { ...COOKIE_OPTIONS, ...options };
  res.cookie(name, value, cookieOptions);
};

/**
 * Clears a custom cookie
 * @param res - Express response object
 * @param name - Cookie name to clear
 * @param options - Optional cookie options for clearing
 */
export const clearCustomCookie = (
  res: Response,
  name: string,
  options?: Partial<typeof COOKIE_OPTIONS>
): void => {
  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
    ...options,
  };
  res.clearCookie(name, clearOptions);
};

/**
 * Gets cookie configuration for reference
 * @returns Current cookie configuration
 */
export const getCookieConfig = () => ({ ...COOKIE_OPTIONS });
