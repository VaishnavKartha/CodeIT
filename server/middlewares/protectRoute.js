import jwt from 'jsonwebtoken';
import User from '../models/user.collection.js';



export const protectRoute=async(req,res,next)=>{

    try {

        const payload = req.cookies.jwt;

        if(!payload){
            return res.status(400).json({message:"Unauthorized"});
        }
        const decoded = jwt.verify(payload,process.env.JWTSECRET);

        if(!decoded){
            return res.status(400).json({message:"Invalid Token"});

        }
        const user = await User.findById(decoded?.userId);

        if(!user){
            return res.status(400).json({message:"User doesnt exist"});
        }
        
        req.user = user;

        next();
        
    } catch (error) {

        console.log(error.message);
        return res.status(500).json({error:error.message});
        
    }


}