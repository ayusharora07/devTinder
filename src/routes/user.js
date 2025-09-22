const express= require("express");
const userRouter= express.Router(); //create a router for auth routes
const { userAuth } = require('../middlewares/auth');//import the userAuth middleware for protected routes
const User= require('../models/user'); //import the user model
const ConnectionRequest = require('../models/connectionRequest');
const { connect } = require("mongoose");

//testting route
userRouter.get("/ping", (req, res) => {
  console.log("✅ Ping route hit");
  res.send("pong");
});
const USER_SAFE_DATA='firstName lastName photoUrl  age gender skills'; //fields to be sent to the client
userRouter.get("/user/requests/received",userAuth, async (req,res)=>{
    try{
        //get all the pending(interested) requests for the logged in user
        const loggedInUser=req.user; //userAuth middleware se milta hai

        const userRequests= await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId',USER_SAFE_DATA ); //populate the fromUserId field with user details

        res.json({
            data: userRequests,
            message: "User requests fetched successfully"
        })
        
    }catch(err){
        res.status(500).send("error fetching user requests"+ err.message);

    }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      /*suppose fetching for ayush ==>  yash 
                             yash ==> lokesh 
        and we want to fetch connections of yash so yash can be one who sent request and also whho accepted the 
        req thats why used OR and status accepted */
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
    // Logged-in user sent the request → show the recipient
            return row.toUserId;
        } else {
    // Logged-in user received the request → show the sender
            return row.fromUserId;
        }
});


    res.json({
      data,
      message: "Connections fetched successfully"
    });
  } catch (err) {
    res.status(500).send("error fetching connections: " + err.message);
  }
});

userRouter.get("/user/feed",userAuth,async(req,res)=>{
  try{
    const loggedInUser=req.user; //userAuth middleware se milta hai
    const connectionRequests=await ConnectionRequest.find({ //model name used
      $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id}
      ],
    }).select("fromUserId toUserId"); //-_id means exclude _id field
    const usersToExclude=new Set();
    connectionRequests.forEach((request)=>{
      usersToExclude.add(request.fromUserId.toString());
      usersToExclude.add(request.toUserId.toString());
    });
    const users=await User.find({
      $and:[
        {_id:{$nin: Array.from(usersToExclude)}}, //exclude users in the set
        {_id:{$ne: loggedInUser._id}}, //exclude the logged in user
      ],
    }).select(USER_SAFE_DATA).limit(10); //limit to 10 users
    res.json({
      data:users,
      message:"feed fetched successfully"
    });
  }catch(err){
    res.status(500).send("error fetching feed"+ err.message);
  }
});

module.exports= userRouter;