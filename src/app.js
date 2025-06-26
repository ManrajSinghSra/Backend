const express=require("express")
const validate = require("./utils/validate");
const app=express()
const {connectDB}=require("./config/dataBase")
const User=require("./models/user")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")

const Auth=require("./middlewares/auth"); 

const authRouter=require("./routers/auth")
const profileRouter=require("./routers/profile")

app.use(express.json())
app.use(cookieParser())
 

//login and signup
app.use("/",authRouter)
app.use("/",profileRouter)
 



// SEND CONNECTION
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