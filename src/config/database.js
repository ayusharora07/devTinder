const mongoose=require('mongoose');
const URL="mongodb+srv://ayusharora7:sQCYHYvjinAKGoON@ayush.nhawxmv.mongodb.net/";

const connectDB=async()=>{
    await mongoose.connect(URL);
}
// basicaly return a promise so you can use aync await for it to handle the promises
connectDB() //called the function which is returning a promise and if it is .then() satisfied promise else eroor eatcched
.then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("error connecting to db",err);
})









//const password="tduAN0MKjCWYy6kV";

const password="sQCYHYvjinAKGoON";
//connection string

//install mongo db compass



