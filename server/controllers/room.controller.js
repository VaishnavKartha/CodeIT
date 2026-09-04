import room from "../models/room.collections.js";
import membership from "../models/membership.collection.js";


export const createRoom=async(req,res)=>{
    try {
        const user = req.user;
        const {roomName,language,isLinkShareable} = req.body;

        if(!roomName?.trim() || !language?.trim()){
            return res.status(400).json({message:"Invalid request"});
        }

        if(!user){
            return res.status(400).json({message:"Unauthorized"});
        }
        
        const newRoom = await room.create({roomName,ownerId:user._id,language:language.toLowerCase(),isLinkSharingEnables:isLinkShareable});

        if(!newRoom){
            return res.status(400).json({message:"Failed to create room"})
        }

        const createMembership = await membership.create({userId:user._id,roomId:newRoom._id,role:"owner"});

        return res.status(200).json(newRoom)
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
        
    }
}


export const joinRoom=async(req,res)=>{
    try {
        const user = req.user;
        const {roomid} = req.params;

        if(!user){
             return res.status(400).json({message:"Unauthorized"});
        }

        if(!roomid){
            return res.status(400).json({message:"Invalid request"});
        }

        const roomInfo = await room.findById(roomid);


        if(!roomInfo){
            return res.status(400).json({message:"Room doesnt exist"});
        }

        const existingUser = await membership.findOne({userId:user._id,roomId:roomid}).populate("roomId","roomName ownerId language");

        if(existingUser){
            return res.status(200).json(existingUser);
        }
       
        if(!roomInfo.isLinkSharingEnables){
            return res.status(400).json({message:"Access Denied"});
        }



        try {
            const newMember = await membership.create({
                userId: user._id,
                roomId: roomid,
                role: roomInfo.linkSharingRole,
            });
            await newMember.populate("roomId", "roomName ownerId language");
            return res.status(200).json(newMember);
        } catch (err) {
            if (err.code === 11000) {
                // Lost the race — someone (or another effect run) already created it.
                // Not a real error: just fetch and return the membership that won.
                const existing = await membership
                    .findOne({ userId: user._id, roomId: roomid })
                    .populate("roomId", "roomName ownerId language");
                return res.status(200).json(existing);
            }
            throw err; // any other error still bubbles up normally
        }


        
    } catch (error) {

        console.log(error.message);
        return res.status(500).json({error:error.message});
        
    }
}

export const getRoomById=async(req,res)=>{
    try {
        const user = req.user;
        const {roomid} = req.params;

        const currentRoom = await room.findById(roomid).select("-ydocState");

        if(!currentRoom){
            return res.status(400).json({message:"Room doesnt exist"});
        }

        return res.status(200).json(currentRoom);

        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}

export const getRooms=async(req,res)=>{
    try {
        const user = req.user;

        const userRooms = await membership.find({userId:user._id}).populate("roomId","roomName ownerId language updatedAt").sort({updatedAt:-1});

        return res.status(200).json(userRooms.length > 0 ? userRooms:[])
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
        
    }
}

export const getRoomMembers=async(req,res)=>{
    try {
        const {roomid:roomId} = req.params;
        //console.log(roomId);
        const members = await membership.find({roomId}).populate("userId","username email")
        //console.log(members);
        return res.status(200).json(members);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}

export const editPermission=async(req,res)=>{
    try {
        const user = req.user;
        const {roomid} = req.params;
        const {shareStatus} = req.body;

        const currentRoom = await room.findById(roomid);

        if(!currentRoom){
            return res.status(400).json({message:"Room not found"});
        }

        if(user._id.toString() !== currentRoom.ownerId.toString()){
            return res.status(400).json({message:"You dont have access to perform this operation"});
        }

        currentRoom.isLinkSharingEnables = shareStatus;
        await currentRoom.save();

        return res.status(200).json({message:"Operation Success"});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
        
    }
}


export const editUserRole=async(req,res)=>{
    try {
        const user = req.user;
        const {roomid:roomId} = req.params;
        const {collabId,role} = req.body;

        const availRoles = ["editor","viewer"];
        if(!role?.trim() || !availRoles.includes(role.toLowerCase())){
            return res.status(400).json({message:"Inavlid Role"});
        }

        const currentRoom = await room.findById(roomId);

        if(!currentRoom){
            return res.status(400).json({message:"Room doesnt exist"});
        }

        if(user._id.toString() !== currentRoom.ownerId.toString()){
            return res.status(400).json({message:"Only owners can edit user roles"});
        }

        const memDetails = await membership.findOne({userId:collabId,roomId});

        if(!memDetails){
            return res.status(400).json({message:"You are not a collaborator of this group"});
        }

        
        memDetails.role=role.toLowerCase();
        await memDetails.save();

        return res.status(200).json({message:"role updated successfully"});


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}


export const updateLanguage=async(req,res)=>{
    try {
        const {language} = req.body;
        const {roomid} = req.params;

        // ToDo:valid language check
       

        const currentRoom = await room.findById(roomid);

        if(!currentRoom){
            return res.status(400).json({message:"Room doesnt exist"});
        }

         currentRoom.language = language.toLowerCase();
         await currentRoom.save();

         return res.status(200).json({message:"Language updated successfully"});




    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}