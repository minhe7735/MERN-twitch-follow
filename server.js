const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");

require("dotenv").config({ path: "./.env.local" });
const CONNECTION_STRING = process.env.DB;
const SESSION_SECRET = process.env.SESSION_SECRET;
const apiRoutes = require("./routes/route");
const authenticate = require("./authentication/authenticate");

const app = express();
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
let collection;
MongoClient.connect(
    CONNECTION_STRING,
    { useUnifiedTopology: true },
    (err, client) => {
        if (err) {
            console.log("Database error: " + err);
        } else {
            const db = client.db("twitch");
            collection = db.collection("users");
            authenticate(collection);
        }
    }
);

app.use(
    "/api",
    (req, res, next) => {
        req.dbCollection = collection;
        next();
    },
    apiRoutes
);

if (process.env.NODE_ENV === "poduction") {
    app.use(express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "/client/build/index.html"));
    });
} else {
    app.use(express.static(path.join(__dirname, "client", "public")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "/client/public/index.html"));
    });
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Listening on port " + port);
});

module.exports = app;
