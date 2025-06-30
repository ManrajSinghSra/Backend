const express=require("express")
const Auth = require("../middlewares/auth")
const { Connect } = require("../models/connectionRequest")
const User = require("../models/user") 

const userRouter=express.Router()


userRouter.get("/user/requests/pending",Auth,async(req,res)=>{

   try {
    const user = req.user;

    const findRequests = await Connect.find({
      to: user._id,
      status: "interested",
    }).populate("from",["firstName","lastName"]) 

    if(!findRequests){
        return res.send("No pending requests")
         
    }
    const userName=findRequests.map((curr)=>curr.from.firstName)    

    res.json({ message: "Requests are from : " + userName.join(" , ") });
   } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`)
    
   }
})


module.exports=userRouter