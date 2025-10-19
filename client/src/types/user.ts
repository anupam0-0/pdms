export type UserRole = "admin" | "seller" | "user";

export interface Address {
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface User {
  id: string;
  fullName: string;
  //   password: string;
  role: UserRole;
  adress: Address;
  createdAt: string;
  updatedAt: string;
}

