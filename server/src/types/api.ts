import { Response } from 'express';

// API Response Types
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// Express Request Extension
declare global {
	namespace Express {
		interface Request {
			user?: import('./models').IUser;
		}
	}
}
