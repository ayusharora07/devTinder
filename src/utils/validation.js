const { validate } = require("../models/user");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password}=req.body;//basicalyy creating a js object with the data
    //first check if all the fields are present
    if(!firstName || !lastName){
        throw new Error("first name and last name are required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password must be valid and strong");
    }
} 