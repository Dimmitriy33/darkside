import { TypedUseSelectorHook, useSelector } from "react-redux";
import rootReducer from "./reducer";

export type rootState = ReturnType<typeof rootReducer>;
const useTypedSelector: TypedUseSelectorHook<rootState> = useSelector;

export default useTypedSelector;
