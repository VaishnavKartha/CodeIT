import membership from '../models/membership.collection.js'
export const validateMembership=async(req,res,next)=>{
    try {
        const allowedRoles = ["owner","editor"];
        const user=req.user;
        const {roomid} = req.params;

        const isMember = await membership.findOne({userId:user._id,roomId:roomid});

        if(!isMember){
            return res.status(400).json({message:"Not a member"})
        }
        if(!allowedRoles.includes(isMember?.role)){
            return res.status(400).json({message:"You dont have permission"});
        }

        
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}