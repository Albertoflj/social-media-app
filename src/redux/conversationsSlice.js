import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: []
}

export const conversationsSlice = createSlice({
    name: "conversations",
    initialState,
    reducers: {
        setConversation: (state, action) =>{
            state.conversations = action.payload;
        }
    }
})

export const {
    setConversation
} = conversationsSlice.actions;
export default conversationsSlice.reducer;