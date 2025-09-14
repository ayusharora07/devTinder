const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt = require('bcrypt'); //import bcrypt for hashing passwords
const jwt=require('jsonwebtoken'); //import jsonwebtoken to create and verify jwt tokens
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  emailId: {
    type:String,
    lowercase: true,
     unique: true,
     trim: true,
     required: true,
     validate(value) {
         if (!validator.isEmail(value)) { //using validator library to validate email
                throw new Error("email is not valid");
            }
        }
     },
    password: {
    type: String,
    required: true,
    minlength: 6},
    age: {
        type:Number,
        min:18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender not valid");
            }
        }
    },
    photoUrl: {
        type:String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png",
        validate(value){
            if(!validator.isURL(value)){ //using validator library to validate url
                throw new Error("photoUrl is not valid");
            }
        }
    },
    location: { type: String },
    about: { type: String },
    skills: [String]
},
  { timestamps: true }
);
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign(
        { userId: user._id },
        "DEV@Tinder",
        { expiresIn: "8h" }
    );
    return token;
};
userSchema.methods.validatePassword= async function(password){
    const user=this;
    return await bcrypt.compare(password,user.password); //compare the plain text password with the hashed password
}

//once schema is created we need to create a model
const User=mongoose.model('User',userSchema); //it will create a collection named users in the database

module.exports=User; //model always starts with capital letter
//export the model so that it can be used in other files