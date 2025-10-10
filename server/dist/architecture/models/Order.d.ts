import mongoose, { Types, Document } from "mongoose";
export interface IOrderItem {
    product: Types.ObjectId;
    quantity: number;
    priceAtPurchase?: number;
}
export interface IOrder extends Document {
    customer: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentMethod: "cod" | "upi" | "card";
    shippingAddress: {
        line1?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map