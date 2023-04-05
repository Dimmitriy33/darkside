import { IUser, IUserLogin, IUserRegister } from "@/components/account/accountTypes";
import httpService from "@/helpers/httpHelper";
import Store, { Types } from "@/redux";
import endPoints from "./endPoints";

export async function apiLogin(user: IUserLogin): Promise<IUser> {
  const res = await httpService.post<IUser>(endPoints.signInUser, user);

  if (res.status < 400) {
    Store.dispatch({
      type: Types.LOGIN,
      data: res.data,
    });
  }

  return res.data;
}

export async function apiRegister(user: IUserRegister): Promise<number> {
  const v = await httpService.post<IUser>(endPoints.signUpUser, user);
  return v.status;
}
