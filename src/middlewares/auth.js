const jwt=require("jsonwebtoken");
const User = require("../models/user");

const Auth=async(req,res,next)=>{

    try {
        const { token } = req.cookies;
        if(!token){
            throw new Error("Please login")
        }

        const {_id} = await jwt.verify(token, "deujgfgsjw");

        const user = await User.findById(_id);

        if (!user) {
          throw new Error("user not exist");
        }
        req.user=user
        next();
    } catch (error) {
        res.status(400).send(error.message);
        //
    }
 
    

     
}

module.exports={Auth}