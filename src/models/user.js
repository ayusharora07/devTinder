const mongoose=require('mongoose');
const validator=require('validator');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,required:true, // String is shorthand for {type: String}
  lastName: String,
  emailId: {
    String,
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
        String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender not valid");
            }
        }
    },
    photoUrl: {
        String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png",
        validate(value){
            if(!validator.isURL(value)){ //using validator library to validate url
                throw new Error("photoUrl is not valid");
            }
        }
    },
    location: String,
    about: String,
    skills: [String],
},
  { timestamps: true }
);

//once schema is created we need to create a model
const User=mongoose.model('User',userSchema); //it will create a collection named users in the database

module.exports=User; //model always starts with capital letter
//export the model so that it can be used in other files