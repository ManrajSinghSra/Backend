const express=require("express") 
const app=express()
const {connectDB}=require("./config/dataBase") 
const cookieParser=require("cookie-parser")
 

const authRouter=require("./routers/auth")
const profileRouter=require("./routers/profile")
const requestRouter=require("./routers/request")
const userRouter=require("./routers/user")

app.use(express.json())
app.use(cookieParser()) 
 

//login and signup
app.use("/",authRouter)
app.use("/",profileRouter) 
app.use("/",requestRouter)
app.use("/",userRouter)
 
 

const serverStart=async()=>{
  try {
    await connectDB()
    console.log("Database Connected")
    app.listen(5001,()=>console.log("Server is Stated on PORT:4001"))
  } catch (error) {
  }
}

serverStart()