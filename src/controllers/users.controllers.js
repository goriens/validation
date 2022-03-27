const express = require("express");
const app = express();
const User = require("../models/users.models");
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get("", async (req, res) => {
    try {
        const users = await User.find().lean().exec();
        return res.status(200).send(users);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
});
router.post("",
    body("first_name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter first name"),
    body("last_name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter last name"),
    body("email")
        .trim()
        .not()
        .isEmpty()
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("Sorry, this email was already exist");
            }
            return true;
        }),
    body("pincode")
        .trim()
        .not()
        .isEmpty()
        .isNumeric()
        .withMessage("Enter a valid pin code")
        .custom((value) => {
            if (value.length !== 6) {
                throw new Error("Enter a valid pin code");
            }
            return true
        }),
    body("age")
        .trim()
        .not()
        .isEmpty()
        .isNumeric()
        .withMessage("Enter a valid age 1 to 100")
        .custom((value) => {
            if (value < 1 || value > 100) {
                throw new Error("Enter a valid age 1 to 100")
            }
            return true
        }),
    body("gender")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please enter your gender")
        .isIn(["Male", "Female", "Others"])
        .withMessage("Please enter your gender"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()[0] });
            }
            const user = await User.create(req.body);
            return res.status(200).send(user);
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    });

module.exports = router;