import mongoose from 'mongoose';

const MembershipSchema = mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    roomId:{type:mongoose.Schema.Types.ObjectId,ref:"Room",required:true},
    role:{type:String,enum:['owner','editor','viewer'],required:true},
    joinedAt:{type:Date,default:Date.now}
});
MembershipSchema.index({ userId: 1, roomId: 1 }, { unique: true });
export default mongoose.model("Membership",MembershipSchema);