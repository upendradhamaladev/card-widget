import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import commonSlice from "./features/commonSlice";
import profileSlice from "./features/profileSlice";
import toastsSlice from "./features/toasts/toastsSlice";
const combineReducer = combineReducers({
  common: commonSlice,
  profile: profileSlice,
  toasts: toastsSlice,
});

const rootReducer = (state: any, action: any) => {
  return combineReducer(state, action);
};
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
