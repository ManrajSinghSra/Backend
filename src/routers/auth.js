const express=require("express")
const bcrypt = require("bcrypt");
const authRouter=express.Router()
const validate = require("../utils/validate");
 
const valiLogin=require("../utils/valiLogin")
const User=require("../models/user"); 

authRouter.post("/login", async (req, res) => {

  try {
    valiLogin(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("INVALID CREDENTIALS");
    }
    const isPass = await user.verifyPass(password);
    if (!isPass) {
      throw new Error("INVALID CREDENTIALS!!!!!");
    } 
    const token = await user.getToken();

    
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1 * 3600000),
      httpOnly: true,
    });

    res.json({user});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/signup",async(req,res)=>{
    try { 
          validate(req.body);
          const {firstName,lastName,emailId,password,age,gender,about}=req.body;
          const find = await User.findOne({emailId});
          
          if(find){
            throw new Error("EMAIL ALREADY TAKEN")
          }
          
          const hashPass = await bcrypt.hash(password, 10);
          
          const user1 = new User({
            firstName,
            lastName,
            emailId,
            password:hashPass,
            age,
            gender,
            about
          });
  
         const user= await user1.save();
         const token = await user1.getToken();

         res.cookie("token", token, {
           expires: new Date(Date.now() + 1 * 3600000),
           httpOnly: true,
         });
          res.json({user});
  
    } 
    
    catch (error) {
          res.status(400).send(`ERROR : ${error.message}`);
    }
    
})
authRouter.post("/logout",(req,res)=>{ 
  res.clearCookie("token").send("Logout successful")
})  
module.exports=authRouter