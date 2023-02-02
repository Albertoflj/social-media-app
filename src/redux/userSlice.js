import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  username: null,
  bio: null,
  photoURL: null,
  followers: [],
  following: [],
  posts: [],
  likedPosts: [],
  savedPosts: [],
  comments: [],
  notifications: [],
  chats: [],
  messages: [],
  chatUsers: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { setUser, setUsername } = userSlice.actions;

export default userSlice.reducer;
