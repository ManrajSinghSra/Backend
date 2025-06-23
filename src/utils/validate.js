const validate=(user)=>{

    const {firstName,lastName,emailId,password}=user

    if(!firstName || !lastName){
        throw new Error("Name is required");
    }

}

module.exports=validate