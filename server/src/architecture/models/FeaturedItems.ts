import { Schema, Types, model, Document } from "mongoose";

export interface IFeaturedItems extends Document {
	item: {
		product: Types.ObjectId;
		expiresOn: Date;
	};
}

const FeaturedItemsSchema = new Schema<IFeaturedItems>({
	item: {
		product: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: [true, "Product is required"],
		},
		expiresOn: {
			type: Date,
			required: [true, "Expiration date is required"],
			default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from today
			validate: {
				validator: function(value: Date) {
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

// Add indexes for better performance
FeaturedItemsSchema.index({ "item.product": 1 });
FeaturedItemsSchema.index({ "item.expiresOn": 1 });
FeaturedItemsSchema.index({ createdAt: -1 });

const FeaturedItems = model<IFeaturedItems>("FeaturedItems", FeaturedItemsSchema);

export default FeaturedItems;
