import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt'


const userSchema = new Schema({
    name: {type: String, unique:true},
    phone: {type: Number},
    email: { type:String, unique:true},
    password: {type: String}

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