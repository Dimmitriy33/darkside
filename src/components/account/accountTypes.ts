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

export interface IUserLogin {
  username: string;
  password: string;
}

export const UserRoles = {
  user: 0,
  admin: 1,
};
