import { IOrder } from "./i-order";

export interface iUser {
id?: number;

 username: string,

 password: string;

 companyName?: string;

  email: string;

  pIVA?: string;

  address: string;

  city: string;

  orders: IOrder[];

  roles: {roleType:string}[];
}
