import { Types, Document } from "mongoose";
export interface IFeaturedItems extends Document {
    item: {
        product: Types.ObjectId;
        expiresOn: Date;
    };
}
declare const FeaturedItems: import("mongoose").Model<IFeaturedItems, {}, {}, {}, Document<unknown, {}, IFeaturedItems, {}, {}> & IFeaturedItems & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default FeaturedItems;
//# sourceMappingURL=FeaturedItems.d.ts.map