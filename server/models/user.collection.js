import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    googleId:{type:String},
},{timestamps:true})

export default mongoose.model("User",userSchema);