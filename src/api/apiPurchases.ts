import { ICartElemBaseExt, ICartsResult, ISearchCartModel } from "@/components/cart/cartTypes";
import httpService from "@/helpers/httpHelper";
import { IProduct } from "@/components/product/productTypes";
import { LocalStorageGetCartElems } from "@/helpers/cartHelper";
import Store, { Types } from "@/redux";
import endPoints from "./endPoints";
import { apiGetProductsByIds } from "./apiProduct";

// eslint-disable-next-line import/prefer-default-export
export async function apiGetPurchases(
  //
  model: ISearchCartModel,
  limit = 10,
  offset = 0
): Promise<ICartsResult | null> {
  let endP = `${endPoints.getPurchases}?limit=${limit}&offset=${offset}`;

  Object.entries(model).forEach((el) => {
    if (el[1] != null) {
      endP += `&${el[0]}=${el[1]}`;
    }
  });

  const res = await httpService.get<ICartsResult>(endP);

  return res?.data;
}

export async function apiGetCurrentCart() {
  const items = LocalStorageGetCartElems();

  if (items.length > 0) {
    const v = await apiGetProductsByIds(items.map((t) => t.productId));
    if (v != null) {
      const elems = (v as IProduct[]).map((i) => ({
        product: i,
        productId: i.id,
        count: items.find((m) => m.productId === i.id)?.count || 0,
      }));

      return elems;
    }

    return [];
  }
  return [];
}

export async function apiCreatePurchase(items: ICartElemBaseExt[]) {
  const body = items.map((v) => ({
    productId: v.productId,
    count: v.count,
  }));

  const res = await httpService.post<ICartsResult>(endPoints.createPurchase, body);
  if (res != null) {
    Store.dispatch({
      type: Types.REMOVE_FULL_CART,
    });
    return true;
  }

  return false;
}
