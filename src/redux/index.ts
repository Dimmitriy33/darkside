import { legacy_createStore as createStore } from "redux";
import Reducer from "./reducer";
import * as Types from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Store = createStore(Reducer);

export { Types };

export default Store;
