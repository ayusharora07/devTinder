const express = require('express');
const User = require('../models/user'); //import the user model
const ConnectionRequestModel = require('../models/connectionRequest'); //import the connection request model
const requestsRouter = express.Router(); //create a router for auth routes
const { userAuth } = require('../middlewares/auth');//import the userAuth middleware for protected routes

requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;  //userAuth middleware se milta hai
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['interested', 'ignored'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send({ error: "Invalid status!" + status });
        }
        //Prevent sending request to self
        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).send({ error: "You cannot send a request to yourself." });
        }
        //what it is ensuring below is that agar already request bhej chuka hai to dubara na bheje from both sides se like agar A ne B ko bheja hai to B se A ko na bheje aur vice versa
         const isConnectionRequestExist = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (isConnectionRequestExist) {
            return res.status(400).send({ error: "Connection request already sent to this user" });
        }
        const toUser= await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send({error: "The user you are trying to connect with does not exist"});
        }
        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
       
        const data = await connectionRequest.save();
        res.json({
            data,
            message: "Connection request sent successfully"
        });
    }
    catch (err) {
        res.status(500).send("error sending request" + err.message);
    }
});

requestsRouter.post("/request/respond/:status/:requestId", userAuth, async (req, res) => {
    try {
        const reviewerId = req.user._id;  //userAuth middleware se milta hai
        const requestId = req.params.requestId; //sender of request
        const status = req.params.status;

        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send({ error: "Invalid status!" + status });
        }
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: reviewerId,
            status: 'interested' //only interested requests can be accepted or rejected
    });
        if (!connectionRequest) {
            return res.status(404).send({ error: "Connection request not found" });
        }
        // Ensure that only the recipient can respond to the request
        if (connectionRequest.toUserId.toString() !== reviewerId.toString()) {
            return res.status(403).send({ error: "You are not authorized to respond to this request" });
        }
        // Update the status of the connection request
        connectionRequest.status = status;
        await connectionRequest.save();
        // Re-fetch with populate (to show user info instead of just ObjectId) more good for client side rendering and frontend hass to not make another call to api to fetch these details
        // Populate the fromUserId and toUserId fields with user details
        const populatedRequest = await ConnectionRequestModel.findById(requestId)
            .populate("fromUserId", "firstName lastName emailId photoUrl")  // show sender details
            .populate("toUserId", "firstName lastName emailId photoUrl");  // show receiver details

        res.json({
            connectionRequest: populatedRequest,
            message: `Connection request ${status} successfully`
        });
    }
    catch (err) {
        res.status(500).send("error responding to request" + err.message);
    }
});

module.exports = requestsRouter;