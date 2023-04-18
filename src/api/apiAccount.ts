import {
  IUser,
  IUserLogin,
  IUserRegister,
  IUpdateUser,
  IUserResetPassword,
  IUsersResultModel,
  ISearchUserModel,
} from "@/components/account/accountTypes";
import httpService from "@/helpers/httpHelper";
import Store, { Types } from "@/redux";
import endPoints from "./endPoints";
import { apiGetCurrentCart } from "./apiPurchases";

export async function apiLogin(user: IUserLogin): Promise<IUser | null> {
  const res = await httpService.post<IUser>(endPoints.signInUser, user);
  if (res !== null) {
    Store.dispatch({
      type: Types.LOGIN,
      data: res.data,
    });
  }

  return res?.data;
}

export async function apiRegister(user: IUserRegister): Promise<IUser> {
  const res = await httpService.post<IUser>(endPoints.signUpUser, user);

  if (res !== null) {
    Store.dispatch({
      type: Types.LOGIN,
      data: res.data,
    });
  }

  return res?.data;
}

export async function apiTopUpBalance(username: string, sum: number): Promise<IUser> {
  const res = await httpService.put<IUser>(endPoints.balance, {
    username,
    sum,
  });

  if (res !== null) {
    Store.dispatch({
      type: Types.CHANGE_BALANCE,
      data: res.data,
    });
  }

  return res?.data;
}

export async function apiUpdateUser(user: IUpdateUser): Promise<IUser> {
  const res = await httpService.put<IUser>(endPoints.currentUser, user);

  if (res !== null) {
    Store.dispatch({
      type: Types.UPDATE_USER,
      data: res.data,
    });
  }

  return res?.data;
}

export async function apiResetPassword(model: IUserResetPassword): Promise<boolean> {
  const res = await httpService.put<void>(endPoints.resetPassword, model);

  if (res.status < 400) {
    return true;
  }

  return false;
}

export async function apiGetCurrentUser(withCart = false): Promise<IUser> {
  const res = await httpService.get<IUser>(endPoints.currentUser);
  if (res !== null) {
    Store.dispatch({
      type: Types.LOGIN,
      data: res.data,
    });
  }

  if (withCart) {
    await apiGetCurrentCart().then((v) => {
      Store.dispatch({
        type: Types.ADD_FULL_CART,
        data: v,
      });
    });
  }

  return res?.data;
}

export async function apiGetUsers(model: ISearchUserModel, limit = 10, offset = 0): Promise<IUsersResultModel> {
  let endP = `${endPoints.getAllUsers}?limit=${limit}&offset=${offset}`;

  Object.entries(model).forEach((el) => {
    if (el[1] != null) {
      endP += `&${el[0]}=${el[1]}`;
    }
  });

  const res = await httpService.get<IUsersResultModel>(endP);

  if (res !== null) {
    return res?.data;
  }

  return {
    totalCount: 0,
    items: [],
  };
}

export async function apiLogout(): Promise<string> {
  const res = await httpService.post<string>(endPoints.logout).catch((e) => e.response);

  if (res !== null) {
    Store.dispatch({
      type: Types.LOGOUT,
    });
  }

  return res?.data;
}
