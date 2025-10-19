import { RegisterFields, LoginFields, EmailValidation, PasswordValidation, ValidationError } from '../types';

export function validateRegisterFields({
  fullName,
  email,
  password,
}: RegisterFields): ValidationError | null {
  if (!fullName || !email || !password) {
    return {
      message: "Missing required fields",
      error: "Full name, email, and password are required",
    };
  }
  return null;
}

export function validateLoginFields({
  email,
  password,
}: LoginFields): ValidationError | null {
  if (!email || !password) {
    return {
      message: "Missing required fields",
      error: "Email and password are required",
    };
  }
  return null;
}

export function isValidEmail({ email }: EmailValidation): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      message: "Invalid email format",
      error: "Please provide a valid email address",
    };
  }
  return null;
}

export function isValidPassword({ password }: PasswordValidation): ValidationError | null {
    console.log(password)
  if (!password || password.length < 6 || password.length > 32) {
    return {
      message: `Invalid password length, ${password.length}`,
      error: "Password must be between 6 and 32 characters long",
    };
  }
  return null;
}
