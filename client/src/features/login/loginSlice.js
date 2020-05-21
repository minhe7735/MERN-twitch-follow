import { createSlice } from "@reduxjs/toolkit";
import { updateLogInStatus } from "../authenticate/authSlice";

export const loginSlice = createSlice({
    name: "login",
    initialState: {
        errDescription: "",
    },
    reducers: {
        updateDescription: (state, action) => {
            state.errDescription = action.payload;
        },
    },
});
export const { updateDescription } = loginSlice.actions;

export const errAsync = (data) => async (dispatch) => {
    try {
        let response = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({ username: data[0], password: data[1] }),
            headers: { "Content-Type": "application/json" },
        });
        let message = await response.json();
        if (message.success) {
            //correct password and username
            dispatch(updateLogInStatus(message.success));
        } else if (message.message) {
            //wrong password or username
            dispatch(updateDescription(message.message));
        }
    } catch (error) {
        return error;
    }
};

export const selectErrDescription = (state) => state.login.errDescription;

export default loginSlice.reducer;
