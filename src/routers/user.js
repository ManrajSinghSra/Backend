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
    }).populate("from","firstName lastName about photoURL")

    

    if(!findRequests){
       throw new Error("No pending requests")
    }    

    res.json({data:findRequests});
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
    }).populate("from to", "firstName lastName about photoURL");


    const userName = findConnections.map((curr) =>{
      if(curr.from._id.toString() === loginUser._id.toString()){
        return curr.to
      }
      return curr.from
    });  

    
    res.json({ data:userName });
  
  } catch (error) {
    res.status(400).send("ERROR : "+error.message)
  }

})

// feed api 

userRouter.get("/feed",Auth,async(req,res)=>{

  try {
    const user=req.user

    const notfeed=await Connect.find({
      $or:[
        {from:user._id},{to:user._id}
      ]
    }).select("from to")


    const hide = new Set();

    hide.add(user._id.toString());

    notfeed.forEach((ele)=>{
      hide.add(ele.from.toString())
      hide.add(ele.to.toString());
    })
 
    const showUser=await User.find({
      $and:[
     {_id:{$nin:Array.from(hide)}},
     {_id:{$ne:user?._id.toString()}}
    ]
    })                                                 
     
    res.json({showUser})
  } 
  catch (error) {
    res.status(400).send(`ERROR : ${error.message}`)
  }

})

module.exports=userRouter