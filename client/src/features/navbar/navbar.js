import React from "react";
import { Link } from "react-router-dom";
import store from "../../app/store";

const Navbar = () => {
    return (
        <div className="flex justify-center bg-purple-500">
            <ul className="flex justify-between w-11/12">
                <li className="">
                    <Link to="/">Home</Link>
                </li>
                <li className="">
                    <Link to="/login">Login</Link>
                </li>
                <li className="">
                    <Link to="/register">Register</Link>
                </li>
                <li className="">
                    <Link to="/userprofile">Profile</Link>
                </li>
                <li className="">
                    <Link
                        to="/logout"
                        onClick={() =>
                            store.dispatch({
                                type: "RESET",
                            })
                        }
                    >
                        Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
