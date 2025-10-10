import { Document, Types } from "mongoose";
export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrls: string[];
    stock: number;
    seller: Types.ObjectId;
    expiryDate?: Date;
}
declare const Product: import("mongoose").Model<IProduct, {}, {}, {}, Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Product;
//# sourceMappingURL=Product.d.ts.map