const mongoose=require("mongoose")

const connectDB=async()=>{

    await mongoose.connect("mongodb+srv://srasinghmanraj:MynameisKhan1!@moon.sff0jqt.mongodb.net/dev");
}

module.exports={connectDB}