const Auth=(req,res,next)=>{

    const token="xyz"

    if(token=="xyz"){
        next()
    }
    else{
        res.status(401).send("Unauthorized access")
    }
}

module.exports={Auth}