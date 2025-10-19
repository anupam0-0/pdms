export interface AuthApiErrorData {
  message?: string;
  [key: string]: unknown;
}

export class AuthApiError extends Error {
  status?: number;
  data?: AuthApiErrorData;
  constructor(message: string, status?: number, data?: AuthApiErrorData) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.data = data;
  }
}
