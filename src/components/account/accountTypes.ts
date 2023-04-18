export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: number;
  balance: number;
}

export interface IUserRegister {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface IUpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUserResetPassword {
  oldPassword: string;
  newPassword: string;
}

export const UserRoles = {
  user: 0,
  admin: 1,
};

export interface ISearchUserModel {
  term?: string;
}

export interface IUsersResultModel {
  totalCount: number;
  items: IUser[];
}
