import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateLogInStatus } from "../authenticate/authSlice";

function Logout() {
    const dispatch = useDispatch();

    useEffect(
        () => async () => {
            try {
                let response = await fetch("/api/logout", {
                    method: "GET",
                    credentials: "include",
                });
                let message = await response.json();

                dispatch(updateLogInStatus(message.message));
            } catch (error) {
                return error;
            }
        },
        [dispatch]
    );

    return (
        <div className="w-full h-screen flex items-center justify-center text-6xl text-red-600 text-center">
            Logout Success
        </div>
    );
}

export default Logout;
