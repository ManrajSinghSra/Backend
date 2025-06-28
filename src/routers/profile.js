const express=require("express")
const Auth=require("../middlewares/auth");
const User = require("../models/user");
const profileRouter=express.Router()
const validateEdit=require("../utils/validateEdit")

const bcrypt=require("bcrypt")

profileRouter.get("/profile/view", Auth, (req, res) => {
  try {
    const user = req.user;
    const userCap=user.firstName[0].toUpperCase()+user.firstName.slice(1)

    res.send(`Hello ${userCap} this is`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/edit",Auth,async(req,res)=>{

  try {  
    
    validateEdit(req.body);
    const user = req.user;


    Object.keys(req.body).forEach((key)=>user[key]=req.body[key])

    

    await user.save()  
    res.send("Updated successfully");

  } catch (error) {
    res.status(400).send(error.message)
  }


})

profileRouter.patch("/profile/password",Auth,async(req,res)=>{


 try {
  const { previousPass, newpassword } = req.body;

  const user = req.user;

  const isCorrect = await user.verifyPass(previousPass);

  if (!isCorrect) {
    throw new Error("Password do not match");
  }

  res.send("password is reseted");
  
 } catch (error) {

  res.send(error.message)
  
 }
  
})


module.exports = profileRouter;