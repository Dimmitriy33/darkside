export function LocalStorageGetCartElems() {
  const cartIdsStr = localStorage.getItem("cart");
  let curCart: Array<ILSCartElem> = [];

  if (cartIdsStr && cartIdsStr !== "undefined") {
    curCart = JSON.parse(cartIdsStr);
  } else {
    return [];
  }

  return curCart;
}

export function LolcalStorageAddToCart(productId: string) {
  let curCart = LocalStorageGetCartElems();

  if (curCart.map((v) => v.productId).includes(productId)) {
    curCart = curCart.map((c) => {
      if (c.productId === productId) {
        c.count += 1;
      }

      return c;
    });
  } else {
    curCart.push({
      productId,
      count: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(curCart));
}

export function LolcalStorageRmFromCart(productId: string) {
  let curCart = LocalStorageGetCartElems();

  if (curCart.map((v) => v.productId).includes(productId)) {
    curCart = curCart
      .map((c) => {
        if (c.productId === productId && c.count > 1) {
          c.count -= 1;
        }

        return c;
      })
      .filter((v) => v.count > 0);
  } else {
    const idx = curCart.findIndex((v) => v.productId === productId);
    curCart.splice(idx, 1);
  }

  localStorage.setItem("cart", JSON.stringify(curCart));
}

export function LolcalStorageRmCart() {
  localStorage.removeItem("cart");
}

export interface ILSCartElem {
  productId: string;
  count: number;
}
