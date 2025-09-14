const  jwt  = require("jsonwebtoken");
const  User  = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if(!token){
            throw new Error("token not found");
        }

        const decodedMessage = await jwt.verify(token, "DEV@Tinder");
        const { userId } = decodedMessage;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("user not found");
        }
        req.user=user;//middleware sending user with request to your async functions;
        next();
    }catch(err){
        res.status(401).send("unauthenticated: " + err.message);
    }
};
module.exports = {userAuth};