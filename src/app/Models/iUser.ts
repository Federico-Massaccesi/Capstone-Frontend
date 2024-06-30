import { IOrder } from "./i-order";

export interface iUser {
id?: number;

 username: string,

 password: string;

 companyName?: string;

  email: string;

  pIVA?: string;

  address: string;

  town: string;

  orders: IOrder[];

  roles: iRole[];

  newsletter:boolean;

  telephoneNumber:number;
}

export interface iRole{
  id?:number;
  roleType:string;
}
