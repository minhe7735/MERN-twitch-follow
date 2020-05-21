const MongoClient = require("mongodb");
//const flash = require("express-flash");
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
//app.use(flash());

app.get("/", apiRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
}

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname + "/client/build/index.html"));
// });

const port = process.env.PORT || 5000;
MongoClient.connect(
    CONNECTION_STRING,
    { useUnifiedTopology: true },
    (err, client) => {
        if (err) {
            console.log("Database error: " + err);
        } else {
            app.listen(port, () => {
                console.log("Listening on port " + process.env.PORT);
                authenticate(app, client);
                apiRoutes(app, client);
            });
        }
    }
);
