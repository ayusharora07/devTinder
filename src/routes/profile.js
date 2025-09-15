const express = require('express');
const User = require('../models/user'); //import the user model
const profileRouter = express.Router(); //create a router for auth routes
const { userAuth } = require('../middlewares/auth');//import the userAuth middleware for protected routes

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  try{
    const user=req.user;
    res.send(user);
  }catch(err){
    res.status(500).send("error fetching profile"+err.message);
  }
});
// PATCH: /profile/edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  console.log("req.body >>>", req.body);
  try {
    const allowedUpdates = ["firstName", "lastName", "age", "gender", "photoUrl", "location", "about", "skills"];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every((field) => allowedUpdates.includes(field));
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    const user = req.user; // from userAuth middleware
    updates.forEach((field) => (user[field] = req.body[field]));

    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: "Error updating profile", details: err.message });
  }
});
const bcrypt = require("bcrypt");

// PATCH: /profile/edit/password
profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send({ error: "Both old and new passwords are required" });
    }
    const user = req.user;
    // 1. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password); //verify old password
    if (!isMatch) {
      return res.status(400).send({ error: "Old password is incorrect" });
    }
    // 2. Update password
    user.password = newPassword; // pre-save hook will hash it
    await user.save();
    res.send({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).send({ error: "Error updating password", details: err.message });
  }
});


module.exports=profileRouter;