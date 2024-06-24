export interface iUser {
id?: number;

 username: string,

 password: string;

 companyName?: string;

  email: string;

  pIVA?: string;

  address: string;

  city: string;

  roles: {roleType:string}[];
}
