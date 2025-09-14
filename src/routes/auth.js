// ## authRouter
// - POST signup
// - POST login
// - POST logout

const express = require('express');
const authRouter = express.Router(); //create a router for auth routes
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user'); //import the user model
const bcrypt = require('bcrypt'); //import bcrypt for hashing passwords

authRouter.post("/signup", async (req, res) => {
  const user = new User(req.body); //create a new user instance using the User model
  try {
    validateSignUpData(req); //validate the data using the function from validation.js
    const { firstName, lastName, emailId, password, age } = req.body;
    //check if user with the same email id already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("user with this email already exists");
    }
    //hash the password before saving to the database
    const passwordHash = await bcrypt.hash(password, 10); //hash the password with a salt round of 10
    req.body.password = passwordHash; //replace the plain text password with the hashed password
    const user=new  User({
      firstName,
      lastName,
      emailId,
      password:passwordHash,
      age,
    }); //create a new user instance using the User model

    await user.save(); //save the user instance to the database 
    //it returns a promise so use async await or .then() and .catch()
    res.send("user signed up"); x
  } catch (err) {
    res.status(500).send("error signing up user" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try{

    const {emailId,password}=req.body;
    const user=await User.findOne({emailId}); //find the user with the given email id
    if(!user){
      return res.status(400).send("invalid credentials");
    }
    const isPasswordMatch=await user.validatePassword(password); //validate the password using the method defined in the user model
    if(isPasswordMatch){
      //create a session or jwt token here for authentication
      const token=await user.getJWT(); //create a jwt token with the user id as payload
      //console.log(token);
      //sending a cookie
      res.cookie("token",token, {
        expires: new Date(Date.now() + 8 * 3600000), //cookie will expire in 8 hours
        httpOnly: true, //cookie cannot be accessed by client side scripts
        secure:true, //cookie will only be sent over https
      });
      res.send("user logged in successfully");
      
    }else{
      throw new Error ("invalid credentials");

    }

    
  }catch(err){
    res.status(500).send("error logging in user" + err.message);
  }
});

module.exports = authRouter;