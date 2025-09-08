const express = require('express');
const connectDB = require('./config/database'); // Ensure the database is connected before handling requests
const User = require('./models/user'); //import the user model
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt'); //import bcrypt for hashing passwords

const app = express();
app.use(express.json()); //middleware to parse json bodies


app.post("/signup", async (req, res) => {
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
    const passwordHash = await bcrypt.hash(req.body.password, 10); //hash the password with a salt round of 10
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
app.post("/login", async (req, res) => {
  try{

    const {emailId,password}=req.body;
    const user=await User.findOne({emailId}); //find the user with the given email id
    if(!user){
      return res.status(400).send("invalid credentials");
    }
    const isPasswordMatch=await bcrypt.compare(password,user.password); //compare the plain text password with the hashed password
    if(!isPasswordMatch){
      return res.status(400).send("invalid credentials");
    }
    res.send("user logged in successfully");
  }catch(err){
    res.status(500).send("error logging in user" + err.message);
  }
});
//route to get only one user by email id
app.get("/users", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail }); //fetch all users from the database
    if (!users) {
      return res.status(404).send("no users found");
    }
    res.json(users); //send the users as a json response
  } catch (err) {
    res.status(500).send("error fetching users" + err.message);
  }
});
//route to get all users in the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find(); //fetch all users from the database
    if (!users) {
      return res.status(404).send("no users found");
    }
    res.json(users); //send the users as a json response
  } catch (err) {
    res.status(500).send("error fetching users" + err.message);
  }
});
//delete by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).send("user not found");
    }
    res.send("user deleted successfully");
  } catch (err) {
    res.status(500).send("error deleting user" + err.message);
  }
})
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; //? represents optional chaining that is if userId is not present it will not throw an error
  const data = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "password ", "about", "skills", "gender", "age"];


  try {
    const isUpdateAllowed = Object.keys(body).every((update/*parameter here*/) => {
      ALLOWED_UPDATES.includes(update);
    });
    if (!isUpdateAllowed) {
      throw new Error("invalid updates");
    }
    if(data?.skills.length>10){
      throw new Error("skills cannot be more than 10");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, //to return the updated document or we can also use returnDocument:true you can use any one of them 
      runValidators: true, //to run the validators defined in the schema
    });
    if (!updatedUser) {
      return res.status(404).send("user not found");
    }
    res.json(updatedUser);

  } catch (err) {
    res.status(500).send("error updating user" + err.message);
  }

});
//connect to the database and then start the server 

connectDB() //called the function which is returning a promise and if it is .then() satisfied promise else eroor eatcched
  .then(() => {
    console.log("connected to db");
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  }).catch((err) => {
    console.log("error connecting to db", err);
  })
