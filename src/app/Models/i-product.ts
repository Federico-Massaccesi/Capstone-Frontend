import { ICategory } from "./i-category";

export interface IProduct {
  id?:number;
name: string,
categories: ICategory[];
price:number;
description:string;
imageUrl:string;
available:boolean;
}

