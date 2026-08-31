import mongoose from "mongoose";
import Membership from '../models/membership.collection.js';


const MONGODBURI = process.env.MONGOURI
async function connectDB(){
    mongoose.connection.on("connected",()=>console.log("MongoDb Connection Successfull"));

    await mongoose.connect(`${MONGODBURI}/codeit`);

     try {
        await Membership.syncIndexes();
        console.log("[db] Membership indexes synced");
    } catch (err) {
        console.error("[db] FAILED to sync Membership indexes:", err.message);
    }

}

export default connectDB;