const express=require("express")

const app=express()

app.use("/",(req,res)=>{
    res.send("hello")
})

app.use("/home",(req,res)=>{
    if(req.url=="/helloe"){
        res.send("this ies secret")
    }
    else
    {
      res.send("Hello from server")
    }
    })

app.listen(3000,()=>{
    console.log("Server is Listening on Port 3000")
})
