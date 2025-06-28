function validateEdit(req){

    const isAllowed=["firstName","lastName","age","gender","about"]
 
    const isEdit=Object.keys(req).every((key)=>isAllowed.includes(key));

    if(!isEdit){
        throw new Error("Invalid request cannot be accepted")
    }
}

module.exports=validateEdit