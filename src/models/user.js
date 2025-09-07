const mongoose=require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String, // String is shorthand for {type: String}
  lastName: String,
  emailId: String,
    password: String,
    age: Number,
  gender: String,
});

//once schema is created we need to create a model
const User=mongoose.model('User',userSchema); //it will create a collection named users in the database

module.exports=User; //model always starts with capital letter
//export the model so that it can be used in other files