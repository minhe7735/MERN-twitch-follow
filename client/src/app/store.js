import {
    configureStore,
    combineReducers,
    getDefaultMiddleware,
} from "@reduxjs/toolkit";
import userProfileReducer from "../features/userProfile/userProfileSlice";
import registerReducer from "../features/register/registerSlice";
import loginReducer from "../features/login/loginSlice";
import authReducer from "../features/authenticate/authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
    key: "root",
    storage: storageSession,
};

const appReducer = combineReducers({
    userProfile: userProfileReducer,
    register: registerReducer,
    login: loginReducer,
    auth: authReducer,
});

// persist state
const rootReducer = (state, action) => {
    if (action.type === "RESET") {
        //clear state on logout
        state = undefined;
    }

    return appReducer(state, action);
};

const persistReducers = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistReducers,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
