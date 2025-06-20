const mongoose=require("mongoose")

const connectDB=async()=>{

    await mongoose.connect("mongodb+srv://srasinghmanraj:MynameisKhan1!@moon.sff0jqt.mongodb.net/");
}

module.exports={connectDB}