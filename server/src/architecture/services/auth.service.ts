import User from "../models/User";
import { IUser } from "../../types";
import { hashPassword } from "../../utils/hashPassword";

export async function createUser(
  fullName: string,
  email: string,
  password: string
): Promise<IUser> {
  const hashed = await hashPassword(password);

  console.log("2:", fullName, email, password);

  return User.create({
    fullName: fullName,
    email: email,
    password: hashed,
  });
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}
