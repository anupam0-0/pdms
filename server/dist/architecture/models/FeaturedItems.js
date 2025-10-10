"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FeaturedItemsSchema = new mongoose_1.Schema({
    item: {
        product: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"],
        },
        expiresOn: {
            type: Date,
            required: [true, "Expiration date is required"],
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            validate: {
                validator: function (value) {
                    return value > new Date();
                },
                message: "Expiration date must be in the future"
            }
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
FeaturedItemsSchema.index({ "item.product": 1 });
FeaturedItemsSchema.index({ "item.expiresOn": 1 });
FeaturedItemsSchema.index({ createdAt: -1 });
const FeaturedItems = (0, mongoose_1.model)("FeaturedItems", FeaturedItemsSchema);
exports.default = FeaturedItems;
//# sourceMappingURL=FeaturedItems.js.map