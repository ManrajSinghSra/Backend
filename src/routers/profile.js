const express=require("express")
const Auth=require("../middlewares/auth"); 
const profileRouter=express.Router()
const validateEdit=require("../utils/validateEdit")
const bcrypt=require("bcrypt")
 

profileRouter.get("/profile/view", Auth, (req, res) => {

  try {
    const user = req.user;
    const userCap=user.displayName()
    res.send(`Hello ${userCap}`);
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
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
  if(previousPass==newpassword){
    res.json({ERROR:"Password cannot be reset"})
  }

  const user = req.user;
  const isCorrect = await user.verifyPass(previousPass);
  if (!isCorrect) {
    throw new Error("Password do not match");
  }

  if(newpassword.includes(" ")){
    throw new Error("SPACE IS NOT VALID IN PASSWORD")
  }
 

  const hashPass= await bcrypt.hash(newpassword,10)

  user["password"]=hashPass
 

   await user.save();

  res.send("password is reseted");
  
 } catch (error) {
  res.status(400).send(`ERROR : ${error.message}`);
 }
  
})


module.exports = profileRouter;