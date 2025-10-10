import mongoose, { Document, Types } from "mongoose";
export interface IInventory extends Document {
    product: Types.ObjectId;
    seller: Types.ObjectId;
    stock: number;
    lowStockThreshold?: number;
}
declare const Inventory: mongoose.Model<IInventory, {}, {}, {}, mongoose.Document<unknown, {}, IInventory, {}, {}> & IInventory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Inventory;
//# sourceMappingURL=Inventory.d.ts.map