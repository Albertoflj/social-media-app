import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  username: null,
  displayName: null,
  bio: null,
  photoURL: null,
  finishedFetching: false,
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
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    setPhotoURL: (state, action) => {
      state.photoURL = action.payload;
    },
    setFinishedFetching: (state, action) => {
      state.finishedFetching = action.payload;
    },
  },
});

export const {
  setUser,
  setUsername,
  setFinishedFetching,
  setPhotoURL,
  setDisplayName,
} = userSlice.actions;

export default userSlice.reducer;
