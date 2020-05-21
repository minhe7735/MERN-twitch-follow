import { createSlice } from "@reduxjs/toolkit";

// switch loginstatus to true after login/register
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        logInStatus: false,
    },
    reducers: {
        updateLogInStatus: (state, action) => {
            state.logInStatus = action.payload;
        },
    },
});
export const { updateLogInStatus } = authSlice.actions;

export const selectStatus = (state) => state.auth.logInStatus;

export default authSlice.reducer;
