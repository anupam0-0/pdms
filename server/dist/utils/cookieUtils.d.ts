import { Response } from "express";
declare const COOKIE_OPTIONS: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none";
    maxAge: number;
};
export declare const setAuthCookie: (res: Response, token: string) => void;
export declare const clearAuthCookie: (res: Response) => void;
export declare const setCustomCookie: (res: Response, name: string, value: string, options?: Partial<typeof COOKIE_OPTIONS>) => void;
export declare const clearCustomCookie: (res: Response, name: string, options?: Partial<typeof COOKIE_OPTIONS>) => void;
export declare const getCookieConfig: () => {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none";
    maxAge: number;
};
export {};
//# sourceMappingURL=cookieUtils.d.ts.map