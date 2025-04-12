import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String, required:true,  unique: true },
    password: { type: String, required:true },
})
userSchema.static.hashPassword = function(clearPassword) {
    return bcrypt.hashSync(clearPassword, 7);
}



const User = mongoose.model('User', userSchema);    
export default User;