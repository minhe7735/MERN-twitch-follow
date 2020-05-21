import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectErrDescription, errAsync } from "./loginSlice";
function Login() {
    const errMessage = useSelector(selectErrDescription);
    const dispatch = useDispatch();

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            {/* show error messages(wrong password or username) */}
            <div className="text-red-600 pb-2">{errMessage}</div>
            <form
                //post username and password to the backend
                onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(errAsync([e.target[0].value, e.target[1].value]));
                }}
                className="grid grid-rows-3"
            >
                <div className="grid grid-cols-2 row-span-1">
                    <label className="col-span-1 text-2xl" htmlFor="username">
                        Username:
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="username"
                        className="border-solid bg-gray-400 col-span-1 rounded-lg opacity-50"
                    />
                </div>
                <div className="grid grid-cols-2 row-span-1">
                    <label className="col-span-1 text-2xl" htmlFor="password">
                        Password:
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        className="border-solid bg-gray-300 col-span-1 rounded-lg opacity-50"
                        autoComplete="on"
                    />
                </div>
                <button
                    className="row-span-1 bg-gray-300 py-2 rounded-lg"
                    type="submit"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
