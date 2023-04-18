export interface IProduct {
  id: string;
  name: string;
  creatorFull: IProductCreator;
  description: string;
  category: string;
  price: number;
  amount: number;
  salePerc?: number;
  imageUrl: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  strength?: number;
  capacity?: number;
  vp?: number;
  isHidden: boolean;
  images: Array<IProductImage>;
  tastes?: Array<IProductTaste>;
}

export interface IProductsResult {
  items: IProduct[];
  totalCount: number;
}

export interface IProductCreator {
  name: string;
  address: IProductCreatorAddress;
  phone?: string;
}

export interface IProductCreatorAddress {
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export interface IProductImage {
  id: number;
  productId: string;
  imageUrl: string;
}

export interface IProductTaste {
  id: number;
  productId: string;
  tasteId: number;
  taste: ITaste;
}

export interface ITaste {
  id: number;
  name: string;
}

export interface ISearchProductModel {
  term?: string;
  category?: string;
  creator?: string;
  priceMin?: number;
  priceMax?: number;
  vpMin?: number;
  vpMax?: number;
}
export interface ICreateProduct {
  name: string;
  creatorName: string;
  creatorPhone: string;
  creatorStreet: string;
  creatorCity: string;
  creatorPostcode: string;
  creatorCountry: string;
  description: string;
  category: string;
  price: number;
  amount: number;
  salePerc?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  strength?: number;
  capacity?: number;
  vp?: number;
  isHidden: boolean;
  imageUrl: File;
  images: File[];
  tastesIds?: Array<number>;
}

export interface IApiCreateProduct {
  name: string;
  creatorFull: IProductCreator;
  description: string;
  category: string;
  price: number;
  amount: number;
  salePerc?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  strength?: number;
  capacity?: number;
  vp?: number;
  isHidden: boolean;
  imageUrl: File;
  images: File[];
  tastesIds?: Array<number>;
}

export interface IUpdateProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  amount: number;
  salePerc?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  strength?: number;
  capacity?: number;
  vp?: number;
  isHidden: boolean;
  tastesIds?: Array<number>;
}
