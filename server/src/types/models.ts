import { Document, Types } from "mongoose";

// User Types
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

// Product Types
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

// Order Types
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

// Inventory Types
export interface IInventory extends Document {
	product: Types.ObjectId;
	seller: Types.ObjectId;
	stock: number;
	lowStockThreshold?: number;
}

// Featured Items Types
export interface IFeaturedItems extends Document {
	item: {
		product: Types.ObjectId;
		expiresOn: Date;
	};
}
