import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


mongoose.connection.on("error", (err) => {
    console.log("Error de conexión ", err);
})

export default function connectMongoose() {
    return mongoose.connect(process.env.MONGODB_URI)
    .then (mongoose => mongoose.connection)
}
