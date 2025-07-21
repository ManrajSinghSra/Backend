const express = require("express");
const Auth = require("../middlewares/auth");
const requestRouter = express.Router();
const {Connect} =require("../models/connectionRequest");
const User = require("../models/user"); 

requestRouter.get("/request/send/:status/:toUserId", Auth, async(req, res) => {
  try {
    const user=req.user
    const from=user._id
    const to=req.params.toUserId
    const status=req.params.status

    const findExistUser=await User.findById(to)

    const findExistRequest=await Connect.findOne(
      {
        $or:[
          {from,to},
          {from:to,to:from}
         ]
      }
    )

    if(!findExistUser){
      throw new Error(
        "The user you are trying to send a request to does not exist."
      );   
     }

     if(findExistRequest){
      throw new Error(
        "Request already exist"
      );   
     } 


    if(from.equals(to)){
      throw new Error("Cannot send request to youself")
    }

    const connection=new Connect({from,to,status})
    await connection.save();
     
    res.json({to,from});
  } 
  catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

// toUser id= my id
//status="accepted","rejected"
// where id exist or not
// change the status if interned to accepted

requestRouter.post("/request/review/:status/:requestId",Auth,async(req,res)=>{


  try {
    const loginUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    const isAllowed = allowedStatus.includes(status);

    if (!isAllowed) {
     return res.status(400).json({ message: "Invalid status" });
    }

    const existID = await Connect.findOne({
      _id: requestId,
      to:loginUser._id,
      status:"interested"      
    });
 
    

    if (!existID) {
       return res.status(400).json({ message: "No request found" });
    }

    existID.status=status;

   const data= await existID.save()

    res.json({message:"Connection request"+status,data})
    
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
    
  }3 


})

module.exports = requestRouter;
