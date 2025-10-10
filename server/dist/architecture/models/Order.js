"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer is required"]
    },
    items: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is required"],
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"],
                min: [1, "Quantity must be at least 1"]
            },
            priceAtPurchase: {
                type: Number,
                min: [0, "Price cannot be negative"]
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"]
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "processing", "shipped", "delivered", "cancelled"],
            message: "Status must be one of: pending, processing, shipped, delivered, cancelled"
        },
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: {
            values: ["cod", "upi", "card"],
            message: "Payment method must be one of: cod, upi, card"
        },
        default: "cod",
    },
    shippingAddress: {
        line1: {
            type: String,
            trim: true,
            maxlength: [200, "Address line cannot exceed 200 characters"],
        },
        city: {
            type: String,
            trim: true,
            maxlength: [50, "City name cannot exceed 50 characters"],
        },
        state: {
            type: String,
            trim: true,
            maxlength: [50, "State name cannot exceed 50 characters"],
        },
        pincode: {
            type: String,
            trim: true,
            match: [/^\d{6}$/, "Pincode must be exactly 6 digits"],
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "items.product": 1 });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=Order.js.map