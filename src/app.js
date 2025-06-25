const express=require("express")
const validate = require("./utils/validate");
const app=express()
const {connectDB}=require("./config/dataBase")
const User=require("./models/user")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")

app.use(express.json())
app.use(cookieParser())

app.get("/user",async(req,res)=>{
  
  const email=req.body.emailId;

  try {
    const user=await User.findOne(email)

    console.log(user);
    
    if(!user){
      res.status(404).send("User not Found !");
    }
    else{
      res.send(user);
    }
    
  } catch (error) {
    console.log("Something went wrong")
    res.send(`Something went wrong ${error}`);
  }
  // res.send("Hello")
})
//login
app.post("/userLogin",async(req,res)=>{
  try {
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

    const token=await jwt.sign({_id:user._id},"deusjw");


    res.cookie("token",token);
    res.send(`Welcome ${cap}`)
  } catch (error) {
    res.status(400).send("INVALID CREDENTIALS")

  }
})

//profile
app.get("/profile",async(req,res)=>{

  console.log(req.cookies)

  res.send("Hello uuser")

})

//feed api
app.get("/feed",async(req,res)=>{
  try {
    
    const users=await User.find({});
    if(users.length===0){
      res.status(404).send("THere is no user")
    }
    else{
      const names=users.map((curr)=>{
        return curr.firstName
      }) 

      res.send(names)
    }
  } 
  catch (error) {
    
    console.log("Something went Wrong", error)
  }
})
app.post("/user",async(req,res)=>{

  try { 

        const {firstName,lastName,emailId,password}=req.body;

        const find = await User.findOne({
          firstName,
          lastName ,
          emailId
        });

        if(find){
          throw new Error("EMAIL ALREADY TAKEN")
        }

        validate(req.body);

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

//patch
app.patch("/user/:email",async(req,res)=>{
  const userId=req.params.email;

 

  try {

    const ALLOWED_UPDATES = ["firstName", "lastName", "gender"];


    const newData=req.body

    const isAllowed=Object.keys(newData).every((key)=>ALLOWED_UPDATES.includes(key))

    if(!isAllowed){
      throw new Error("This request cannot be fullfiled")
    }
    const newD=await User.findOneAndUpdate({emailId:userId},newData,{runValidators:true});
    res.send("User is Updated")
    
  } catch (error) {
    res.status(400).send(`There is an error ${error.message}`);
  }
}) 

//delete by email id
app.delete("/user/:email",async(req,res)=>{

  const email=req.params.email

  console.log(email);
  
  try {
    const user=await User.findOneAndDelete({emailId:email})

    if(!user){
      res.status(404).send("Something went wrong hdere");
    }
    else{
      res.send(`User ${email} is deleted `)
    }
    
  } catch (error) {
    console.log("Something went wrong ",error)
  }
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