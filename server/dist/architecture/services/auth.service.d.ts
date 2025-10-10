import { IUser } from "../models/User";
export declare function createUser(email: string, password: string, fullName: string): Promise<IUser>;
export declare function findUserByEmail(email: string): Promise<IUser | null>;
//# sourceMappingURL=auth.service.d.ts.map