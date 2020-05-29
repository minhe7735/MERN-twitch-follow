const passport = require("passport");
const ObjectId = require("mongodb").ObjectID;
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const express = require("express");

const saltRounds = 10;
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({ status: req.isAuthenticated() });
};

const ensureNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.json({ status: req.isAuthenticated() });
    }
    return next();
};

const validUserNameAndPassWordRegEx = /[^A-Za-z0-9!@#$]/g;
router.post("/register", ensureNotAuthenticated, async (req, res, next) => {
    try {
        if (req.body.username.match(validUserNameAndPassWordRegEx)) {
            return res.json({
                message: "username contains invalid charaters",
            });
        }
        if (req.body.password.match(validUserNameAndPassWordRegEx)) {
            return res.json({
                message: "password contains invalid charaters",
            });
        }
        if (req.body.username.length < 1) {
            return res.json({
                message: "username must be longer than 1 character",
            });
        }
        if (req.body.password.length < 1) {
            return res.json({
                message: "password must be longer than 1 character",
            });
        }
        req.session.cookie.expires = false;
        const collection = req.dbCollection;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const addNewUser = await collection.findOneAndUpdate(
            { username: req.body.username },
            {
                $setOnInsert: {
                    password: hashedPassword,
                    following: [],
                },
            },
            { upsert: true }
        );
        if (addNewUser.value) {
            return res.json({ message: "username taken" });
        } else {
            passport.authenticate("local")(req, res, () => {
                res.json({ success: req.isAuthenticated() });
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post("/login", ensureNotAuthenticated, (req, res, next) => {
    req.session.cookie.expires = false;
    const collection = req.dbCollection;
    passport.authenticate("local", function (err, user, info) {
        if (err) return next(err);
        if (info) return res.json(info);
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ success: req.isAuthenticated() });
        });
    })(req, res, next);
});
router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    return res.json({ success: req.isAuthenticated() });
});
router
    .route("/userProfile")
    .get(async (req, res) => {
        const collection = req.dbCollection;
        collection.findOne(
            { username: req.user.username },
            async (err, userInfo) => {
                try {
                    let follows = userInfo.following;
                    let urlLive =
                        "https://api.twitch.tv/helix/streams?user_login=";
                    let urlProfile = "https://api.twitch.tv/helix/users?login=";
                    for (const ele of follows) {
                        if (ele === follows[0]) {
                            urlLive += ele;
                            urlProfile += ele;
                        } else {
                            urlLive += `&user_login=${ele}`;
                            urlProfile += `&login=${ele}`;
                        }
                    }
                    let responseLive = await fetch(urlLive, {
                        headers: {
                            Authorization: `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
                            "client-id": process.env.TWITCH_CLIENT_ID,
                        },
                    });
                    let dataLive = await responseLive.json();
                    let responseProfile = await fetch(urlProfile, {
                        headers: {
                            Authorization: `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
                            "client-id": process.env.TWITCH_CLIENT_ID,
                        },
                    });
                    let dataProfile = await responseProfile.json();
                    res.json({
                        dataLive: dataLive.data,
                        dataProfile: dataProfile.data,
                    });
                } catch (error) {
                    return error;
                }
            }
        );
    })
    .put(async (req, res) => {
        let streamer = req.body.toAdd.toLowerCase();
        let responseLive = await fetch(
            `https://api.twitch.tv/helix/users?login=${streamer}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
                    "client-id": process.env.TWITCH_CLIENT_ID,
                },
            }
        );
        let dataLive = await responseLive.json();
        if (dataLive.data.length === 0) {
            return res.json({
                message: "streamer with the username doesnt exist",
            });
        }
        const collection = req.dbCollection;

        collection.findOneAndUpdate(
            {
                username: req.user.username,
                following: { $ne: streamer },
            },
            { $push: { following: streamer } },
            { returnOriginal: false },
            (err, data) => {
                if (err) return err;
                return res.json(data.value);
            }
        );
    })
    .delete((req, res) => {
        const collection = req.dbCollection;
        collection.findOneAndUpdate(
            {
                username: req.user.username,
            },
            { $pull: { following: req.body.toRemove } },
            { returnOriginal: false },
            (err, data) => {
                if (err) return error;
                return res.json(data.value);
            }
        );
    });

module.exports = router;
