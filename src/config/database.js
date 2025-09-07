const mongoose=require('mongoose');
const URL="mongodb+srv://ayusharora:sQCYHYvjinAKGoON@namastenode.naetxdk.mongodb.net/";//after '/' add the name of the database you want to create
// mongoose.connect(URL); //this returns a promise so we can use .then() and .catch() to handle it

const connectDB=async()=>{
    await mongoose.connect(URL);
}
// basicaly return a promise so you can use aync await for it to handle the promises
// connectDB() //called the function which is returning a promise and if it is .then() satisfied promise else eroor eatcched
// .then(()=>{
//     console.log("connected to db");
// }).catch((err)=>{
//     console.log("error connecting to db",err);
// })

module.exports=connectDB;
// export the function so that it can be used in app.js

// this whole connect db will be in application.js file








//const password="tduAN0MKjCWYy6kV";

const password="sQCYHYvjinAKGoON";
//connection string

//install mongo db compass



