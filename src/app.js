const express=require("express")
const validate = require("./utils/validate");
const app=express()
const {connectDB}=require("./config/dataBase")
const User=require("./models/user")


app.use(express.json())

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
    console.log(req.body);
    const user = new User(req.body);

    const find = await User.findOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
    });
    if(find){
      throw new Error("User already Exists")
    }

    validate(user);

    await user.save();
    res.send("User successfully added");

  } catch (error) {
    console.log("THere is an error ",error.message)
    res.send(`ERROR : ${error.message}`);
  }
  
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