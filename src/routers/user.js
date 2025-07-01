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
userRouter.get("/user/connections",Auth,async(req,res)=>{

  try {
    const loginUser = req.user;

    const findConnections = await Connect.find({
      $or: [
        { from: loginUser._id, status: "accepted" },
        { to: loginUser._id, status: "accepted" },
      ],
    }).populate("from to", "firstName lastName");
    const userName = findConnections.map((curr) =>{
      if(curr.from._id.toString() === loginUser._id.toString()){
        return curr.to
      }
      return curr.from
    });  
    res.json({ message:userName });
  
  } catch (error) {
    res.status(400).send("ERROR : "+error.message)
  }

})

// feed api 

userRouter.get("/feed",Auth,async(req,res)=>{

  try {
    const user=req.user
    const {page,limit}=req.query

    const skip=(page-1)*limit 
    

    const notfeed=await Connect.find({
      $or:[
        {from:user._id},{to:user._id}
      ]
    }).select("from to")

    const hide = new Set();

    notfeed.forEach((ele)=>{
      hide.add(ele.from.toString())
      hide.add(ele.to.toString());
    })
 
    const showUser=await User.find({
      _id:{$nin:Array.from(hide)}
    }).skip(skip).limit(limit)
 

    res.json(showUser)
  } 
  catch (error) {
    res.status(400).send(`ERROR : ${error.message}`)
  }

})

module.exports=userRouter