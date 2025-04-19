import mongoose from "mongoose";

const {MONGODB_URI} = process.env
mongoose.connection.on("error", (err) => {
    console.log("Error de conexión ", err);
})

export default function connectMongoose() {
    return mongoose.connect(MONGODB_URI)
    .then (mongoose => mongoose.connection)
}
