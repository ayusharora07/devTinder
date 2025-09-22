const express = require('express');
const connectDB = require('./config/database'); // Ensure the database is connected before handling requests
const User = require('./models/user'); //import the user model
const cookieParser = require('cookie-parser'); //import cookie-parser to parse cookies
const app = express();
app.use(express.json()); //middleware to parse json bodies
app.use(cookieParser()); //middleware to parse cookies

const authRouter = require('./routes/auth'); //import the auth routes
app.use('/', authRouter); //use the auth routes with the prefix /auth

const profileRouter = require('./routes/profile'); //import the profile routes
app.use('/', profileRouter); //use the profile routes with the prefix /user

const requestsRouter = require('./routes/requests'); //import the requests routes
app.use('/', requestsRouter); //use the requests routes with the prefix /requests

const userRouter= require('./routes/user'); //import the user routes
app.use('/', userRouter); //use the user routes with the prefix /user
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
