import { Schema, model, Document } from "mongoose";

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

const userSchema = new Schema<IUser>(
	{
		fullName: {
			type: String,
			required: [true, "Full name is required"],
			trim: true,
			minlength: [2, "Full name must be at least 2 characters"],
			maxlength: [100, "Full name cannot exceed 100 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"],
		},
		role: {
			type: String,
			enum: {
				values: ["user", "seller", "admin"],
				message: "Role must be either user, seller, or admin",
			},
			default: "user",
		},
		address: {
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
	},
	{ 
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Add indexes for better performance
// Note: email index is automatically created by unique: true
userSchema.index({ role: 1 });

const UserModel = model<IUser>("User", userSchema);
export default UserModel;
