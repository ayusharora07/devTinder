const express = require('express');
const connectDB=require('./config/database'); // Ensure the database is connected before handling requests
const User=require('./models/user'); //import the user model

const app = express();
app.use(express.json()); //middleware to parse json bodies

app.post("/signup",async (req,res)=>{
    const user=new User(req.body); //create a new user instance using the User model
    try{
      await user.save(); //save the user instance to the database 
      //it returns a promise so use async await or .then() and .catch()
      res.send("user signed up");x
    }catch(err){
      res.status(500).send("error signing up user"+ err.message);
    }
});

connectDB() //called the function which is returning a promise and if it is .then() satisfied promise else eroor eatcched
.then(()=>{
    console.log("connected to db");
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.log("error connecting to db",err);
}) 
 