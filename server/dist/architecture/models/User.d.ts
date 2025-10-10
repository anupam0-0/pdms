import { Document } from "mongoose";
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    role: "user" | "seller" | "admin";
    address: {
        line1: string;
        city: string;
        state: string;
        pincode: string;
    };
}
declare const UserModel: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default UserModel;
//# sourceMappingURL=User.d.ts.map