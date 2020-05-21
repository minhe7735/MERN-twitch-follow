const passport = require("passport");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

module.exports = async (app, client) => {
    const db = (await client).db("twitch");
    const collection = await db.collection("users");
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        collection.findOne({ _id: new ObjectID(id) }, (err, user) => {
            done(null, user);
        });
    });
    passport.use(
        //user and password authentication
        new LocalStrategy(function (username, password, done) {
            db.collection("users").findOne(
                { username: username },
                (err, user) => {
                    console.log("User " + username + " attempted to log in.");
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: "No user with that username found",
                        });
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {
                            message: "Incorrect password",
                        });
                    }
                    return done(null, user);
                }
            );
        })
    );
};
