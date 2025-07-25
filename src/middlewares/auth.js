const jwt=require("jsonwebtoken");
const User = require("../models/user");

const Auth=async(req,res,next)=>{

    try {

    
        const { token } = req.cookies;  
        if(!token){
            throw new Error("Please login")
        }
      
        const {_id} =  jwt.verify(token, "deujgfgsjw");
        const user = await User.findById(_id);

        if (!user) {
          throw new Error("user not exist");
        }
        req.user=user
        next();
    } catch (error) {
        res.status(401).send(`ERROR : ${error.message}`);
    }
}

module.exports=Auth