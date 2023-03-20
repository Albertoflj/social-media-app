import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import conversationsReducer from "./conversationsSlice";
import postsReducer from "./postsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationsReducer,
    post: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
