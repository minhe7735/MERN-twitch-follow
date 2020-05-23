import { createSlice } from "@reduxjs/toolkit";

export const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: {
        offline: {},
        online: {},
        message: "",
    },
    reducers: {
        loadUserProfile: (state, action) => {
            state.offline = action.payload["offline"];
            state.online = action.payload["online"];
        },
        loadMessage: (state, action) => {
            state.message = action.payload;
        },
    },
});

export const { loadUserProfile, loadMessage } = userProfileSlice.actions;

export const addFollows = (newFollow) => async (dispatch) => {
    try {
        let response = await fetch("/api/Follows", {
            method: "PUT",
            body: JSON.stringify({ toAdd: newFollow }),
            headers: { "Content-Type": "application/json" },
        });
        let message = await response.json();
        if (message["message"]) {
            dispatch(loadMessage(message["message"]));
        } else {
            dispatch(loadMessage(message["message"]));
            dispatch(getFollows());
        }
    } catch (error) {
        return error;
    }
};

export const removeFollows = (followToRemove) => async (dispatch) => {
    try {
        let response = await fetch("/api/Follows", {
            method: "DELETE",
            body: JSON.stringify({ toRemove: followToRemove }),
            headers: { "Content-Type": "application/json" },
        });
        let message = response.json();
        dispatch(getFollows());
    } catch (error) {
        return error;
    }
};

export const getFollows = () => async (dispatch) => {
    try {
        let response = await fetch(`/api/Follows`);
        let follows = await response.json();
        let offline = {};
        let online = {};

        if (follows["dataProfile"]) {
            for (let x of follows["dataProfile"]) {
                offline[x.id] = { ...offline[x.id], ...x };
            }
            for (let x of follows["dataLive"]) {
                offline[x.user_id] = { ...offline[x.user_id], ...x };
                online[x.user_id] = offline[x.user_id];
                delete offline[x.user_id];
            }
            dispatch(loadUserProfile({ offline: offline, online: online }));
        } else {
            dispatch(loadUserProfile({ offline: {}, online: {} }));
        }
    } catch (error) {
        sessionStorage.clear();
        window.location.reload();
        console.clear();
        console.log(error);
    }
};

export const selectOffline = (state) => state.userProfile.offline;
export const selectOnline = (state) => state.userProfile.online;
export const selectMessage = (state) => state.userProfile.message;

export default userProfileSlice.reducer;
