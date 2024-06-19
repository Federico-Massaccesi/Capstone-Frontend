import { IProduct } from "./i-product";
import { iUser } from "./iUser";

export interface IOrder {

  id?:number;

   client:iUser;

   products: IProduct[];

   localDate:Date;

  pending:boolean;

  totalPrice:number;
}
