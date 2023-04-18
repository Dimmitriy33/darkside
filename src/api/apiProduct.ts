import httpService from "@/helpers/httpHelper";
import {
  IApiCreateProduct,
  ICreateProduct,
  IProduct,
  IProductsResult,
  ISearchProductModel,
  ITaste,
  IUpdateProduct,
} from "@/components/product/productTypes";
import endPoints from "./endPoints";

export async function apiGetCategories(): Promise<string[] | null> {
  const res = await httpService.get<string[]>(endPoints.getCategories);

  return res?.data;
}

export async function apiGetCreators(): Promise<string[] | null> {
  const res = await httpService.get<string[]>(endPoints.getCreators);
  return res?.data;
}

export async function apiGetProduct(id: string): Promise<IProduct> {
  const res = await httpService.get<IProduct>(`${endPoints.product}?id=${id}`);
  return res?.data;
}

export async function apiGetTastes(): Promise<ITaste[]> {
  const res = await httpService.get<ITaste[]>(endPoints.getTastes);
  return res?.data;
}

export async function apiGetProducts(
  model: ISearchProductModel,
  limit = 10,
  offset = 0
): Promise<IProductsResult | null> {
  let endP = `${endPoints.getProducts}?limit=${limit}&offset=${offset}`;

  Object.entries(model).forEach((el) => {
    if (el[1] != null) {
      endP += `&${el[0]}=${el[1]}`;
    }
  });

  const res = await httpService.get<IProductsResult>(endP);

  return res?.data;
}

export async function apiGetProductsByIds(ids: string[]): Promise<IProduct[] | null> {
  const res = await httpService.post<IProduct[]>(endPoints.productsByIds, ids);
  return res?.data;
}

export async function apiCreateProd(model: ICreateProduct): Promise<IProduct> {
  const creator = {
    name: model.creatorName,
    address: {
      street: model.creatorStreet,
      postcode: model.creatorPostcode,
      city: model.creatorCity,
      country: model.creatorCountry,
    },
    phone: model.creatorPhone,
  };

  const reqModel = {
    name: model.name,
    creatorFull: creator,
    description: model.description,
    category: model.category,
    price: model.price,
    amount: model.amount,
    salePerc: model.salePerc,
    length: model.length,
    width: model.width,
    height: model.height,
    weight: model.weight,
    strength: model.strength,
    capacity: model.capacity,
    vp: model.vp,
    isHidden: model.isHidden,
    imageUrl: model.imageUrl,
    images: model.images,
    tastesIds: model.tastesIds,
  } as IApiCreateProduct;

  const formData = new FormData();

  Object.entries(reqModel).forEach((v) => {
    if (!Array.isArray(v[1]) && v[1] != null && v[0] !== "creatorFull") formData.append(v[0], v[1]);
  });

  // reqModel.images.forEach((v) => {
  //   formData.append("images", v);
  // });
  formData.append("CreatorFull.Name", reqModel.creatorFull.name);
  formData.append("CreatorFull.Address.Street", reqModel.creatorFull.address.street);
  formData.append("CreatorFull.Address.City", reqModel.creatorFull.address.city);
  formData.append("CreatorFull.Address.Postcode", reqModel.creatorFull.address.postcode);
  formData.append("CreatorFull.Address.Country", reqModel.creatorFull.address.country);
  if (reqModel.creatorFull.phone) {
    formData.append("CreatorFull.Phone", reqModel.creatorFull.phone);
  }

  reqModel.images.forEach((v) => {
    formData.append("images", v);
  });

  // [reqModel.imageUrl, reqModel.imageUrl].forEach((v) => {
  //   formData.append("images", v);
  // });

  reqModel.tastesIds?.forEach((v) => {
    formData.append("tastesId", v);
  });

  const res = await httpService.post<IProduct>(endPoints.product, formData);
  return res?.data;
}

export async function apiUpdateProd(product: IUpdateProduct) {
  const res = await httpService.put<IProduct>(endPoints.product, product);
  return res?.data;
}

export async function apiUpdateProdMainImage(id: string, file: File) {
  const formData = new FormData();
  formData.append("imageUrl", file);
  formData.append("id", id);
  const res = await httpService.put<IProduct>(endPoints.productMainImg, formData);
  return res?.data;
}

export async function apiDeleteProd(id: string): Promise<void> {
  await httpService.delete(`${endPoints.product}?id=${id}`);
}
