export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrls: string[];
  stock: number;
  seller: string;
  expiryDate?: Date;
}

export interface FeaturedItems {
  item: {
    product: Product;
    expiresOn: Date;
  };
}
