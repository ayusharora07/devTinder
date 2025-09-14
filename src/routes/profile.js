const express = require('express');
const User = require('../models/user'); //import the user model
const profileRouter = express.Router(); //create a router for auth routes
const { userAuth } = require('../middlewares/auth');//import the userAuth middleware for protected routes

profileRouter.get("/profile",userAuth,async(req,res)=>{
  try{
    const user=req.user;
    res.send(user);
  }catch(err){
    res.status(500).send("error fetching profile"+err.message);
  }


});
module.exports=profileRouter;