import mongoose,{Schema} from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
})



const User = mongoose.model('User', userSchema);    
export default User;