import { Schema, model } from "mongoose";
import { IProduct } from "../../types";

const productSchema = new Schema<IProduct>(
    {
        name: { 
            type: String, 
            required: [true, "Product name is required"], 
            trim: true,
            minlength: [2, "Product name must be at least 2 characters"],
            maxlength: [200, "Product name cannot exceed 200 characters"]
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"]
        },
        category: { 
            type: String, 
            required: [true, "Category is required"],
            trim: true,
            maxlength: [50, "Category cannot exceed 50 characters"]
        },
        price: { 
            type: Number, 
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        imageUrls: {
            type: [String],
            validate: {
                validator: function(urls: string[]) {
                    return urls.length <= 10;
                },
                message: "Cannot have more than 10 images"
            }
        },
        stock: { 
            type: Number, 
            required: [true, "Stock is required"],
            min: [0, "Stock cannot be negative"],
            default: 0 
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller is required"],
        },
        expiryDate: {
            type: Date,
            validate: {
                validator: function(value: Date) {
                    return !value || value > new Date();
                },
                message: "Expiry date must be in the future"
            }
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Add indexes for better performance
productSchema.index({ name: "text", category: "text" });
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ expiryDate: 1 });
productSchema.index({ createdAt: -1 });

const Product = model<IProduct>("Product", productSchema);
export default Product;