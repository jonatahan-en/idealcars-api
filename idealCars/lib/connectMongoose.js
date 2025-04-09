import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


mongoose.connection.on("error", (err) => {
    console.error("Error de conexión ", err);
})

export default function connectMongoose() {
    return mongoose.connect(process.env.MONGODB_URI)
}
