import User, { IUser } from "../models/User";
import { hashPassword } from "../../utils/hashPassword";

export async function createUser(email: string, password: string, fullName: string): Promise<IUser> {
  const hashed = await hashPassword(password);
  return User.create({ email, password: hashed, fullName });
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}