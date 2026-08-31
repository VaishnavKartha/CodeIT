import mongoose from 'mongoose'

const RoomSchema = mongoose.Schema({
    roomName:{type:String,required:true,default:()=>`Untitled-${new Date().toLocaleDateString()}`},
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    language:{type:String,required:true,default:'javascript'},
    ydocState:{type:Buffer},
    isLinkSharingEnables:{type:Boolean,default:true},
    linkSharingRole:{type:String,enum:['editor','viewer'],default:'editor'}
},{timestamps:true});

export default mongoose.model("Room",RoomSchema);