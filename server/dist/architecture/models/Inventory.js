"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const inventorySchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Seller is required"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
        min: [0, "Low stock threshold cannot be negative"]
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
inventorySchema.index({ product: 1, seller: 1 }, { unique: true });
inventorySchema.index({ stock: 1 });
const Inventory = (0, mongoose_1.model)("Inventory", inventorySchema);
exports.default = Inventory;
//# sourceMappingURL=Inventory.js.map