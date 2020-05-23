import React from "react";
import { useSelector } from "react-redux";
import UserProfile from "./features/userProfile/userProfile";
import Login from "./features/login/login";
import Register from "./features/register/register";
import Home from "./features/home/home";
import Logout from "./features/logout/logout";
import Navbar from "./features/navbar/navbar";
import { selectStatus } from "./features/authenticate/authSlice";

import { Route, Redirect, Switch } from "react-router-dom";

function App() {
    const loggedIn = useSelector(selectStatus);
    return (
        <div className="App max-w-full">
            <Navbar />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route
                    exact
                    path="/login"
                    render={() =>
                        loggedIn ? <Redirect to={"/userProfile"} /> : <Login />
                    }
                />
                <Route
                    exact
                    path="/register"
                    render={() =>
                        loggedIn ? (
                            <Redirect to={"/userProfile"} />
                        ) : (
                            <Register />
                        )
                    }
                />
                <Route
                    exact
                    path="/userProfile"
                    render={() =>
                        !loggedIn ? <Redirect to={"/login"} /> : <UserProfile />
                    }
                />
                <Route exact path="/logout" component={Logout} />;
                <Route render={() => <Redirect to={"/"} />} />
            </Switch>
        </div>
    );
}
export default App;
