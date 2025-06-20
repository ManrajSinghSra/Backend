const express = require("express");
const {Auth}=require("./middlewares/auth")
const app = express();

const {connectDB}=require("./config/dataBase")


app.use("/user",Auth);


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


