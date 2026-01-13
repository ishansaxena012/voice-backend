import mongoose from "mongoose"; 
import { DB_NAME } from "../utils/constants.js";
import dotenv from "dotenv";

dotenv.config();


const connectDB = async () => {
    try {
        const connectionInstace = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`); 
        
        console.log("MONGODB CONNECTED (db/index.js)"); 
        console.log(`\n MONGODB HOST: ${connectionInstace.connection.host}`); 
    } catch (error) {
        console.log("MONGODB CONN ERROR: ", error); 
        process.exit(1);
    }
}

export default connectDB;