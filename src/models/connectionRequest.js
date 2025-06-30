const mongoose=require("mongoose")

const connectionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status:{
    type:String,
    enum:{
        values:["accepted","rejected","ignored","interested"],
        message:`{VALUE} is not a valid request`
    }
    
    // validate(value){
    //     const  values=["accepted","rejected","ignored","interested"]

    //     if(!values.includes(value)){
    //         throw new Error(`${value} is not a valid request`)
    //     }
    // }
  }
},{
    timestamps:true
});

const Connect=mongoose.model("connections",connectionSchema);

module.exports={Connect}