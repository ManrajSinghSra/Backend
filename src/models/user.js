const mongoose=require("mongoose")
const vali=require("validator")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxLength:30,
      
    },
    lastName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxLength:30
    },
    emailId: {
      type: String,
      unique:true,
      lowercase:true,
      trim:true,
      validate(value){
        if(value==""){
            throw new Error("Email is Empty")
        }
        else if(!vali.isEmail(value)){
           throw new Errow("This Email is Not valid")
        }
      }

    },
    password: {
      type: String,
      minLength:[5,"Passwors is too short"],
      maxLength:15
    },
    age: {
      type: Number,
      min:[0,"Age Cannot be negative"],
      max:[120,"Age is too high to be real"]

    },
    gender: {
      type: String,
      lowercase:true,
      validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("Invalid Gender , Gender must be male , female and others.")
        }
      }
    },
  },
  {
    timestamps: true,
  }
);

const User=mongoose.model("DevUser",userSchema)

module.exports = User;