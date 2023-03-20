import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import conversationsReducer from "./conversationsSlice";


export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationsReducer,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});
