import { Product } from "./product";
import { Address, User } from "./user";

type Status = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentMethod = "cod" | "upi" | "card";

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  customer: User;
  items: OrderItem[];
  totalAmount: number;
  status: Status;
  paymentMethod: PaymentMethod;
  shippingAdress: Address;
}
