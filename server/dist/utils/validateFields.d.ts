export declare function validateRegisterFields({ fullName, email, password, }: {
    fullName?: string;
    email?: string;
    password?: string;
}): {
    message: string;
    error: string;
} | null;
export declare function validateLoginFields({ email, password, }: {
    email?: string;
    password?: string;
}): {
    message: string;
    error: string;
} | null;
export declare function isValidEmail({ email }: {
    email: string;
}): {
    message: string;
    error: string;
} | null;
export declare function isValidPassword({ password }: {
    password: string;
}): {
    message: string;
    error: string;
} | null;
//# sourceMappingURL=validateFields.d.ts.map