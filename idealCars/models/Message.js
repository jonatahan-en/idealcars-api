import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: {type: String,required: true,trim: true},
    
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User', required: true},
    adId: {type: mongoose.Schema.Types.ObjectId,ref: 'Product', required: true},
    createdAt: {type: Date,default: Date.now},
    expiresAt: { type: Date, default: () => Date.now() + 5 * 60 * 1000 },
});
// Configurar índice TTL para eliminar automáticamente los mensajes después de `expiresAt`
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Crear el modelo de mensajes
const Message = mongoose.model('Message', messageSchema);

export default Message;