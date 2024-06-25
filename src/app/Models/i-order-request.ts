import { iCartItem } from "./cart-item";

export interface IOrderRequest {
  id?: number;
  client: number;
  items: iCartItem[];
  localDate: Date;
  pending: boolean;
  totalPrice: number;
  checked: boolean;
}
