const validate=(user)=>{

    const {firstName,lastName,emailId,password}=user

    if(!firstName || !lastName){
        throw new Error("Name is required");
    }

    if(password.length<6){
        throw new Error("Password is too short")
    }

}

module.exports=validate