import { createSlice } from "@reduxjs/toolkit";
import { updateLogInStatus } from "../authenticate/authSlice";

export const registerSlice = createSlice({
    name: "register",
    initialState: {
        errDescription: "",
    },
    reducers: {
        updateDescription: (state, action) => {
            state.errDescription = action.payload;
        },
    },
});
export const { updateDescription } = registerSlice.actions;

export const errAsync = (data) => async (dispatch) => {
    try {
        let response = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ username: data[0], password: data[1] }),
            headers: { "Content-Type": "application/json" },
        });
        let message = await response.json();

        if (message.success) {
            //valid username and password
            dispatch(updateLogInStatus(message.success));
        } else if (message.message) {
            //invalid username or password
            dispatch(updateDescription(message.message));
        }
    } catch (error) {
        return error;
    }
};

export const selectErrDescription = (state) => state.register.errDescription;
export default registerSlice.reducer;
