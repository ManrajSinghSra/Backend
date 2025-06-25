const express=require("express")
const validate = require("./utils/validate");
const valiLogin=require("./utils/valiLogin")
const app=express()
const {connectDB}=require("./config/dataBase")
const User=require("./models/user")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")

const {Auth}=require("./middlewares/auth");
const e = require("express");

app.use(express.json())
app.use(cookieParser())
 


//login  --done token part
app.post("/login",async(req,res)=>{
  try {

    valiLogin(req.body);

    const {emailId,password}=req.body
    const user=await User.findOne({emailId})
    if(!user){
      throw new Error("INVALID CREDENTIALS");
    } 

    const isPass= await bcrypt.compare(password,user.password);

    if(!isPass){
      throw new Error("INVALID CREDENTIALS");
    }

    const cap=user.firstName.charAt(0).toLocaleUpperCase()+user.firstName.slice(1)

    const token=await jwt.sign({_id:user._id},"deujgfgsjw",{expiresIn:"1d"});


    res.cookie("token",d);
    res.send(`Welcome ${cap}`)
  } 
  catch (error) {
    res.status(400).send(error.message)

  }
})
 

//create new user
app.post("/signup",async(req,res)=>{

  try { 

        const {firstName,lastName,emailId,password}=req.body;
        validate(req.body);

        const find = await User.findOne({
          firstName,
          lastName ,
          emailId
        });

        if(find){
          throw new Error("EMAIL ALREADY TAKEN")
        }
        
        const hashPass = await bcrypt.hash(password, 10);
        const user = new User({
          firstName,
          lastName,
          emailId,
          password:hashPass,
        });

        await user.save();

        res.send("User successfully added");

  } 
  
  catch (error) {
        console.log(`ERROR : ${error.message}`)
        res.send(`ERROR : ${error.message}`);
  }
  
})

app.post("/sendConnectionRequest",Auth,async(req,res)=>{

  res.send("Request send")

})


// add at once
app.post("/userAll",async(req,res)=>{

  const users=req.body

  users.forEach(async(curr) => {

    try {
          const { firstName, lastName, emailId, password } = curr;

          const user = await User.findOne({
            firstName,
            lastName,
            emailId
          });

          if (user) {
            throw new Error("Email Alreadt Taken");
          }
          validate(curr)

          const hash=await bcrypt.hash(password,10);

          const addedUser = new User({ firstName, lastName, emailId, password:hash });

          addedUser.save()

         

    } 
    catch (error) {

          res.status(400).send(`Error : ${error.message}`)
      
    }
  });

  res.send("Users is successfully added");

   
})
 
 

const serverStart=async()=>{

  try {

    await connectDB()
    console.log("Database Connected")

    app.listen(5001,()=>console.log("Server is Stated on PORT:4001"))
  } catch (error) {
    
  }
}


serverStart()