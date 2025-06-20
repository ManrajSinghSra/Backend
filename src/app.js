const express = require("express");

const app = express();

const handle1=(req,res,next)=>{
  next() 
  console.log("End")

} 
const handle2 = (req, res,next) => {
  next()
};

const handle3=(req,res)=>{
  res.send("three")
}
 

app.get("/user",[handle1,handle2],handle3)

 
app.listen(9001, () => {
  console.log("Server is Listening on Port 3000");
});
