import { IUser } from "@/components/account/accountTypes";
import { Action } from "redux";
import * as types from "./types";

const initialState: IState = {
  isLoggedIn: false,
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

      if (!actionV.data.isLogged) {
        result.currentUser = null;
        result.isLoggedIn = false;
      }
      Object.assign(result, {
        isLogged: actionV.data.isLogged,
        currentUser: actionV.data.currentUser,
      });

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
  isLoggedIn: boolean;
  currentUser: IUser | null;
  lang: string;
}
