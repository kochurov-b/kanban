import { createStore } from "redux";
import rootReducer from "./reducers";

export type AppState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer);
