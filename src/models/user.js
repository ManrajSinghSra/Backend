const mongoose = require("mongoose");
const vali = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: 30,
      minLength:3
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: 30,
    },
    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (value == "") {
          throw new Error("Email is Empty");
        } else if (!vali.isEmail(value)) {
          throw new Errow("This Email is Not valid");
        }
      },
    },
    password: {
      type: String,
      minLength: [5, "Passwors is too short"],
      maxLength: 90,
    },
    age: {
      type: Number,
      min: [0, "Age Cannot be negative"],
      max: [120, "Age is too high to be real"],
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error(
            "Invalid Gender , Gender must be male , female and others."
          );
        }
      },
    },
    about: {
      type:String,
      maxLength:200,
      trim:true,
      validate(value){
        if(!/^[a-zA-Z0-9\s.,!?'"()-]*$/.test(value)){
         throw new Error("Invalid about section")
        }
      }

    },
  },
  {
    timestamps: true,
  }
);


userSchema.methods.getToken =  function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "deujgfgsjw", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.verifyPass = async function (pass) {
  const user = this;
  const hashedPass = user.password
  const isValid = await bcrypt.compare(pass, hashedPass);
  return isValid;
};

userSchema.methods.displayName=function(){
  const user=this;
  return user.firstName.charAt(0).toLocaleUpperCase() + user.firstName.slice(1);
}


const User = mongoose.model("DevUser", userSchema);

module.exports = User;
