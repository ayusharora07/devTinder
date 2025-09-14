const express = require('express');
const User = require('../models/user'); //import the user model
const requestsRouter = express.Router(); //create a router for auth routes
const { userAuth } = require('../middlewares/auth');//import the userAuth middleware for protected routes



module.exports=requestsRouter;