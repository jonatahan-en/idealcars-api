import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt'


const userSchema = new Schema({
    name: { type: String, required: true, unique: true},
    phone: {type: Number},
    email: { type: String, required:true,  unique: true },
    password: { type: String, required:true },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// método estático que hace un hash de una contraseña
userSchema.statics.hashPassword = function(clearPassword){
    return bcrypt.hash(clearPassword, 7)
}
// método de instancia, comprueba que la password coincide
userSchema.methods.comparePassword = function(clearPassword){
    return bcrypt.compare(clearPassword, this.password)
}


const User = mongoose.model('User', userSchema);    
export default User;