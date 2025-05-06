import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt'
import * as emailManager from '../lib/emailManager.js'


const userSchema = new Schema({
    name: { type: String, required: true,},
    phone: {type: Number},
    email: { type: String, required:true,  unique: true },
    password: { type: String, required:true },
})

// método estático que hace un hash de una contraseña
userSchema.statics.hashPassword = function(clearPassword){
    return bcrypt.hash(clearPassword, 7)
}
// método de instancia, comprueba que la password coincide
userSchema.methods.comparePassword = function(clearPassword){
    return bcrypt.compare(clearPassword, this.password)
}

userSchema.methods.sendEmail = async function(subject, body){
    const transport = await emailManager.createTransport()
    console.log(`Sending email to ${this.email}...`)
    const result = await transport.sendMail({
        from: process.env.EMAIL_SERVICE_FROM,
        to: this.email,
        subject,
        html: body
    })
    if( process.env.NODECARS_ENV ==='development'){
        console.log(`Email simulated. Preview: ${emailManager.generatePreviewURL(result)}`)
    }
}
userSchema.methods.sendEmailBetweenUsers = async function (from,to,subject,content) {
    const transport = await emailManager.createTransport()
    
    const result = await transport.sendMail({
        from,
        to,
        subject:`Me interesa tu ${subject}`,
        html: content

    })
    
    console.log("Resultado del envío:", result);  // Verifica si hay algún resultado
}


const User = mongoose.model('User', userSchema);    
export default User;