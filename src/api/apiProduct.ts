import httpService from "@/helpers/httpHelper";
import { IProduct, ISearchModel } from "@/components/product/productTypes";
import endPoints from "./endPoints";

export async function apiGetCategories(): Promise<string[] | null> {
  const res = await httpService.get<string[]>(endPoints.getCategories);

  return res?.data;
}

export async function apiGetCreators(): Promise<string[] | null> {
  const res = await httpService.get<string[]>(endPoints.getCreators);
  return res?.data;
}

export async function apiGetProducts(model: ISearchModel, limit = 10, offset = 0): Promise<IProduct[] | null> {
  let endP = `${endPoints.getProducts}?limit=${limit}&offset=${offset}`;

  Object.entries(model).forEach((el) => {
    if (el[1] != null) {
      endP += `&${el[0]}=${el[1]}`;
    }
  });

  const res = await httpService.get<IProduct[]>(endP);

  return res?.data;
}

export async function apiDeleteProd(id: string): Promise<void> {
  await httpService.delete(`${endPoints.product}?id=${id}`);
}
