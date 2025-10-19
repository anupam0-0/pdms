// Validation Types
export interface ValidationError {
  message: string;
  error: string;
}

export interface RegisterFields {
  fullName?: string;
  email?: string;
  password?: string;
}

export interface LoginFields {
  email?: string;
  password?: string;
}

export interface EmailValidation {
  email: string;
}

export interface PasswordValidation {
  password: string;
}
