import { Product } from "./product";
import { User } from "./user";

export interface Inventory {
  product: Product[];
  seller: User;
  stock: number;
  lowStockThreshold: number;
}
