import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/userSlice";
import contactReducer from "./slices/contactSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    contact: contactReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;