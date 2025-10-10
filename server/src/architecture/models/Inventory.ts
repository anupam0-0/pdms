import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface IInventory extends Document {
	product: Types.ObjectId;
	seller: Types.ObjectId;
	stock: number;
	lowStockThreshold?: number;
}

const inventorySchema = new Schema<IInventory>(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: [true, "Product is required"],
		},
		seller: { 
			type: Schema.Types.ObjectId, 
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
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Add indexes for better performance
// Note: compound index { product: 1, seller: 1 } automatically creates indexes for both fields
inventorySchema.index({ product: 1, seller: 1 }, { unique: true }); // Ensure one inventory per product per seller
inventorySchema.index({ stock: 1 });

const Inventory = model<IInventory>("Inventory", inventorySchema);

export default Inventory;
