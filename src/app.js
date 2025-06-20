const express = require("express");
// const {Auth}=require("./middlewares/auth")
const app = express();

const {connectDB}=require("./config/dataBase")
const User=require("./models/user")

// app.use("/user");

app.post("/signup",async(req,res)=>{

  const userObj={
    firstName:"Manraj",
    lastName:"Singh",
    emailId:"man@m.com",
    password:123,
    age:20,
    gender:"Male"
  }

  const user=new User(userObj)

   await user.save()

   res.send("User Created")

})


app.get("/user",(req,res)=>{
  res.send("All data send")
})

const startServer=async()=>{
    try {
      await connectDB();
      console.log("Connected Successfully");

      app.listen(9001, () => {
        console.log("Server is Listening on Port 3000");
      });
      
    } catch (error) {
      
      console.log("Some error Occurs",error.message)
    }

}
startServer()


