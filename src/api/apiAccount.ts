import { IUser, IUserLogin, IUserRegister } from "@/components/account/accountTypes";
import httpService from "@/helpers/httpHelper";
import Store, { Types } from "@/redux";
import endPoints from "./endPoints";

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

export async function apiGetCurrentUser(): Promise<IUser> {
  const res = await httpService.get<IUser>(endPoints.getCurrentUser);
  if (res !== null) {
    Store.dispatch({
      type: Types.LOGIN,
      data: res.data,
    });
  }

  return res?.data;
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
