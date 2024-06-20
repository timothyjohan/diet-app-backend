const express = require("express");
const router = express.Router();
const Users = require("../../models/Users");

router.get("/", (req, res) => {
    res.send("GET request to the ");
});

router.get("/getUsers", async (req, res) => {
    const userTemp = await Users.find();
    res.send(userTemp);
});

async function userStreak(email, reset) {
    try {
        let update;
        if (reset) {
            update = await Users.updateOne({ email: email }, { streaks: 0 });
        } else {
            update = await Users.updateOne(
                { email: email },
                { streaks: streaks + 1 }
            );
        }
        return update;
    } catch (error) {
        return error;
    }
}
// Check email exist middleware
const checkEmailExist = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send("Email is required");
    }

    try {
        const user = await Users.findOne({ email: email });
        if (user) {
            return res.status(400).send("Email is already in use");
        }
        next();
    } catch (error) {
        return res.status(500).send(`Error checking email: ${error.message}`);
    }
};

// Add account
router.post("/add", checkEmailExist, async (req, res) => {
    const { email, password, name, gender } = req.body;

    if (!email || !password || !name || !gender) {
        return res.status(400).send("invalid fields");
    }

    let newUser = {
        email: email,
        password: password,
        name: name,
        gender: gender,
        calories: 0,
        streaks: 0,
    };
    try {
        const insert = await Users.create(newUser);
        return res.status(201).send(insert);
    } catch (error) {
        return res.status(400).send(`${error}`);
    }
});

router.put("/streaks/:email", async (req, res) => {
    const { email } = req.params;
    const { reset } = req.query;
    let mode = false;
    let streaksCount = 0;
    try {
        let result = await Users.findOne({ email: email });
        streaksCount = result.streaks + 1;
    } catch (error) {
        return res.status(400).send(error);
    }

    if (!email) {
        return res.status(400).send("Email field invalid");
    }

    if (!reset) {
        update = await Users.updateOne(
            { email: email },
            { streaks: streaksCount }
        );
        return res.status(201).send("Streaks added");
    } else {
        update = await Users.updateOne({ email: email }, { streaks: 0 });
        return res.status(201).send("Streaks reseted");
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const login = await Users.findOne({ email: email, password: password });

    if (login) {
        return res.status(200).send("MASUK");
    } else {
        return res.status(401).send("NDAK");
    }
});

router.get("/leaderboard", async (req, res) => {
    const { top } = req.query;
    if (!top) {
        const getTop = await Users.find().sort({ streaks: -1 }).limit(3);
        return res.status(200).send(getTop);
    } else {
        const getTop = await Users.find().sort({ streaks: -1 }).limit(top);
        return res.status(200).send(getTop);
    }
});

module.exports = router;
