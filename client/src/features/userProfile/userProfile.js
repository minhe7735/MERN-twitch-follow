import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    selectOffline,
    addFollows,
    removeFollows,
    getFollows,
    selectOnline,
    selectMessage,
} from "./userProfileSlice";

function UserProfile() {
    const dispatch = useDispatch();
    const offline = useSelector(selectOffline);
    const online = useSelector(selectOnline);
    const message = useSelector(selectMessage);

    useEffect(() => {
        dispatch(getFollows());
    }, [dispatch]);

    return (
        <div className="flex flex-col justify-center items-center w-full mt-2">
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    dispatch(addFollows(e.target.twitchUserId.value));
                }}
            >
                <label className="text-2xl" htmlFor="twitchUserId">
                    twitch.tv/
                    <span>
                        <input
                            className="bg-gray-400 rounded-lg h-12 w-64 sm:w-48 text-2xl"
                            id="twitchUserId"
                            name="twitchUserId"
                            type="text"
                            placeholder="username"
                        />
                    </span>
                    <button
                        className="bg-orange-300 px-2 py-1 ml-1 rounded-md hover:bg-orange-200"
                        type="submit"
                    >
                        Add
                    </button>
                </label>
                <div className="text-red-500">{message}</div>
            </form>
            <ul className="mt-4 w-full flex flex-col justify-center items-center">
                <div className=" rounded-lg w-3/4 md:w-full">
                    {Object.entries(online).map(([key, value]) => {
                        return (
                            <li className=" flex justify-between " key={key}>
                                <div
                                    className="flex flex-row w-11/12 bg-green-300 hover:bg-blue-300 cursor-pointer border-solid rounded-l-lg border-2 border-green-600 p-2 "
                                    onClick={() => {
                                        window.open(
                                            `https://www.twitch.tv/${value.display_name}`
                                        );
                                    }}
                                >
                                    <img
                                        className="object-scale-down w-24 h-auto"
                                        src={value.profile_image_url}
                                        alt="profile"
                                    />
                                    <div className="w-11/12 truncate ml-2">
                                        <div className="w-11/12 truncate">
                                            {value.display_name} - Viewers:{" "}
                                            {value.viewer_count}
                                        </div>
                                        <div className="w-11/12 truncate">
                                            {value.title}
                                        </div>
                                        <div className="w-11/12 truncate">
                                            Online since:{" "}
                                            {new Date(
                                                value.started_at
                                            ).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/12">
                                    <button
                                        className="h-full md:w-full bg-yellow-300 rounded-lg rounded-l-none hover:bg-red-300"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(
                                                removeFollows(value.login)
                                            );
                                        }}
                                    >
                                        <p className="transform rotate-90">
                                            delete
                                        </p>
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </div>
                <div className="rounded-lg w-3/4 md:w-full">
                    {Object.entries(offline).map(([key, value]) => {
                        return (
                            <li
                                className="flex justify-between w-full  "
                                key={value.id}
                            >
                                <div className="flex w-11/12 bg-red-300 border-solid border-2 rounded-l-lg border-red-600 p-2">
                                    <img
                                        className="object-scale-down w-24 h-24"
                                        src={value.profile_image_url}
                                        alt="profile"
                                    />
                                    <div className="text-5xl md:text-3xl flex justify-center items-center w-full">
                                        <div>{value.display_name}: OFFLINE</div>
                                    </div>
                                </div>
                                <div className="w-1/12">
                                    <button
                                        className="h-full md:w-full bg-yellow-300 rounded-lg rounded-l-none hover:bg-red-300"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(
                                                removeFollows(value.login)
                                            );
                                        }}
                                    >
                                        <p className="transform rotate-90">
                                            delete
                                        </p>
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </div>
            </ul>
        </div>
    );
}

export default UserProfile;
