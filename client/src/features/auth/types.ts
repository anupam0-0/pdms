export interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}


