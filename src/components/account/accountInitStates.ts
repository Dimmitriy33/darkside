import { IUserLogin, IUserRegister } from "./accountTypes";

export const initRegisterState: IUserRegister = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
};

export const initLoginState: IUserLogin = {
  username: "",
  password: "",
};
