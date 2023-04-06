import { IUser } from "@/components/account/accountTypes";
import { Action } from "redux";
import * as types from "./types";

const initialState: IState = {
  isLogged: false,
  currentUser: null,
  lang: "en",
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
        localStorage.removeItem("token");
      } else if (actionV.data.token) {
        localStorage.setItem("token", actionV.data.token);
      }

      Object.assign(result, {
        isLogged: true,
        currentUser: actionV.data,
      });

      return result;
    }
    case types.LOGOUT: {
      const result = { ...state };

      Object.assign(result, {
        isLogged: false,
        currentUser: null,
      });
      localStorage.removeItem("token");

      return result;
    }
    case types.SWITCHLANG: {
      const result = { ...state };
      const actionV = { ...action } as IAction;

      Object.assign(result, {
        lang: actionV.data.lang,
      });

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
  currentUser: IUser | null;
  lang: string;
}
