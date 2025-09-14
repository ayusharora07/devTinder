const { validate } = require("../models/user");

const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("first name and last name are required");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("password must be valid and strong");
    }
};

module.exports = { validateSignUpData };
