import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any = null,
  error: string | null = null
): void => {
  const response: ApiResponse = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (error !== null) {
    response.error = error;
  }

  res.status(status).json(response);
};

// Convenience methods for common responses
export const sendSuccess = (res: Response, message: string, data: any = null): void => {
  sendResponse(res, 200, true, message, data);
};

export const sendCreated = (res: Response, message: string, data: any = null): void => {
  sendResponse(res, 201, true, message, data);
};

export const sendBadRequest = (res: Response, message: string, error?: string): void => {
  sendResponse(res, 400, false, message, null, error);
};

export const sendUnauthorized = (res: Response, message: string, error?: string): void => {
  sendResponse(res, 401, false, message, null, error);
};

export const sendForbidden = (res: Response, message: string, error?: string): void => {
  sendResponse(res, 403, false, message, null, error);
};

export const sendNotFound = (res: Response, message: string, error?: string): void => {
  sendResponse(res, 404, false, message, null, error);
};

export const sendServerError = (res: Response, message: string, error?: string): void => {
  sendResponse(res, 500, false, message, null, error);
};
