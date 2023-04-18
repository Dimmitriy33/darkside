import { IUser, UserRoles } from "@/components/account/accountTypes";
import { Action } from "redux";
import { ICartElemBaseExt } from "@/components/cart/cartTypes";
import { LolcalStorageAddToCart, LolcalStorageRmCart, LolcalStorageRmFromCart } from "@/helpers/cartHelper";
import * as types from "./types";

const initialState: IState = {
  isLogged: false,
  isAdmin: false,
  currentUser: null,
  lang: "",
  cart: [],
};

const initialAction: Action<number> = {
  type: -1,
};

function Reducer(state = initialState, action: Action<number> = initialAction): IState {
  if (action.type === -1) {
    console.warn(`Reducer.Error: action is null!`);
    return initialState;
  }
  switch (action.type) {
    case types.LOGIN: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      if (!actionV.data) {
        result.currentUser = null;
        result.isLogged = false;
        result.isAdmin = false;
        localStorage.removeItem("token");
      } else if (actionV.data.token) {
        localStorage.setItem("token", actionV.data.token);
      }

      Object.assign(result, {
        isLogged: true,
        isAdmin: actionV.data.role === UserRoles.admin,
        currentUser: actionV.data,
      });

      return result;
    }
    case types.UPDATE_USER: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      Object.assign(result, {
        isAdmin: actionV.data.role === UserRoles.admin,
        currentUser: actionV.data,
      });

      return result;
    }
    case types.CHANGE_BALANCE: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      const user = { ...result.currentUser };
      Object.assign(result, {
        currentUser: { ...user, balance: actionV.data },
      });

      return result;
    }
    case types.LOGOUT: {
      const result = { ...state };

      Object.assign(result, {
        isLogged: false,
        isAdmin: false,
        currentUser: null,
      });
      localStorage.removeItem("token");

      return result;
    }
    case types.SWITCHLANG: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      localStorage.setItem("lang", actionV.data.lang);

      Object.assign(result, {
        lang: actionV.data.lang,
      });

      return result;
    }
    case types.ADD_TO_CART: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      let curCart = [...result.cart];

      if (curCart.map((v) => v.productId).includes(actionV.data.id)) {
        curCart = curCart.map((c) => {
          if (c.productId === actionV.data.id) {
            c.count += 1;
          }

          return c;
        });
      } else {
        curCart.push({
          product: actionV.data,
          productId: actionV.data.id,
          count: 1,
        });
      }

      Object.assign(result, {
        cart: curCart,
      });

      LolcalStorageAddToCart(actionV.data.id);
      return result;
    }
    case types.REMOVE_FROM_CART: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      let curCart = [...result.cart];

      if (curCart.map((v) => v.productId).includes(actionV.data)) {
        curCart = curCart
          .map((c) => {
            c.count -= 1;
            return c;
          })
          .filter((v) => v.count > 0);
      } else {
        const idx = curCart.findIndex((v) => v.productId === actionV.data);
        curCart.splice(idx, 1);
      }

      Object.assign(result, {
        cart: curCart,
      });

      LolcalStorageRmFromCart(actionV.data.id);
      return result;
    }
    case types.ADD_FULL_CART: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      Object.assign(result, {
        cart: actionV.data,
      });

      return result;
    }
    case types.REMOVE_FULL_CART: {
      const result = { ...state };

      Object.assign(result, {
        cart: [],
      });

      LolcalStorageRmCart();
      return result;
    }
    default:
      console.warn(`Reducer.Error: there no actions for type ${action.type}`, action);
      break;
  }
  return state;
}

export default Reducer;

interface IAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  type: number;
}

export interface IState {
  isLogged: boolean;
  isAdmin: boolean;
  currentUser: IUser | null;
  lang: string;
  cart: ICartElemBaseExt[];
}
