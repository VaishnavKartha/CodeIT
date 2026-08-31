import googleClient from "../lib/gConfig.js";
import User from "../models/user.collection.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const generateToken=(userId,res)=>{

    const JWTSECRET = process.env.JWTSECRET;

    const token = jwt.sign({userId},JWTSECRET,{expiresIn:"7d"});

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:false
    })

    return token

}

export const signup=async(req,res)=>{
    try {

        const {username,email,password} = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        if(!username?.trim() || !password?.trim() || password.length < 6){
            return res.status(400).json({message:"Invalid username or password"});
        }
        if(!email.trim() || !emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email"});
        }

        const user = await User.findOne({email});
        const hashedPassword = await bcrypt.hash(password,10);

        if(user){

            /*
                if(user.googleId && !user.password){
                    user.password = hashedPassword;
                    await user.save();

                    const token = generateToken(user._id,res);

                    return res.status(200).json({message:"Password added"});
                }
            */

            return res.status(400).json({message:"User already exists"});
        }
        

        const newUser = await User.create({username,email,password:hashedPassword});
        if(!newUser){
            return res.status(400).json({message:"Account creation failed"})
        }

        const token = generateToken(newUser._id,res);
        const data = {userId:newUser._id, username:newUser.username,email:newUser.email}
        return res.status(200).json(data);
        
    } catch (error) {

        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"});
        
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        if(!password.trim() || password.length < 6){
            return res.status(400).json({message:"Invalid password"});
        }
        if(!email.trim() || !emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User doesnt exists"});
        }

        if(!user.password){
            return res.status(400).json({message:"This account is signed in via Gmail"})
        }


        const hashedPassword = user.password;

        const isPasswordCorrect = await bcrypt.compare(password,hashedPassword);

        if(!isPasswordCorrect){
            return res.status(400).json({message:"Wrong Password"});
        }

        const token = generateToken(user._id,res);

        if(!token){
            return res.status(400).json({message:"Login Failed"});
        }

        return res.status(200).json({userId:user._id,username:user.username,email:user.email});


    } catch (error) {
        
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}

export const googleAuth=async(req,res)=>{
    try {
        console.log("Google auth route reached");
        const url = googleClient.generateAuthUrl({
        access_type: "online",
        scope: [
            "openid",
            "email",
            "profile"
        ]
    });

    console.log("🔥 Google URL generated");
    console.log(url);

    res.redirect(url);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Google Sign-in error"});
        
    }
}

export const redirect=async(req,res)=>{
    try {

         const { code } = req.query;

        const { tokens } = await googleClient.getToken(code);

        googleClient.setCredentials(tokens);

        //console.log(tokens);

        const { data } = await googleClient.request({
            url: "https://www.googleapis.com/oauth2/v2/userinfo"
        });

        //console.log(data);

        const {id:googleId,email,name} = data;

        let user = await User.findOne({email});
     
        if(user){

            if(!user.googleId){
                user.googleId = googleId;
                await user.save();

            }
        }else{
            user = await User.create({username:name,email,googleId});
          
        }

        const token = generateToken(user._id,res);
        console.log(token);

        if(!token){
            return res.status(400).json({message:"login failed"})
        }

        return res.redirect("http://localhost:5173/");



    } catch (error) {
        console.error(error);

        res.status(500).send("Google authentication failed");
        
    }
}


export const getMe=async(req,res)=>{
    try {
        const user = req.user
        //console.log(user);
        return res.status(200).json({userId:user._id,username:user.username,email:user.email})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({error:error.message});
        
    }
}

export const logout=async(req,res)=>{
    try {
        const user = req.user;
        res.cookie("jwt","",{maxAge:0})
        return res.status(200).json({message:"Logged Out successfully"})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
        
    }
}

export const deleteAccount=async(req,res)=>{
    try {
        const user = req.user;

        const deletedUser = await User.findByIdAndDelete(user._id);
        if(!deletedUser){
            return res.status(400).json({message:"An Error Occured"});
        }

        return res.status(200).json({message:"Account Deleted"});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}