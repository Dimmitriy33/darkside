import { IUser } from "../account/accountTypes";
import { IProduct } from "../product/productTypes";

export interface ICartElemBase {
  productId: string;
  count: number;
}

export interface ICartElemBaseExt extends ICartElemBase {
  product: IProduct;
}

export interface ICartElem {
  id: number;
  userId: string;
  user: IUser;
  date: Date;
  totalPrice: number;
  items: ICartElemBaseExt[];
}

export interface ISearchCartModel {
  term?: string;
}

export interface ICartsResult {
  items: ICartElem[];
  totalCount: number;
}
