import { Server } from 'socket.io';
import * as sessionManager from './lib/sessionManager.js';
import Message from './models/Message.js';
import Product from './models/Products.js';
import User from './models/User.js';

export let io;
export function setupSocketServer(httpServer) {
    io = new Server(httpServer);

    // Usar middleware de sesión
    io.engine.use(sessionManager.middleware);

    io.on('connection', async (socket) => {
        const userId = socket.request.session.userId;

        // Unir al cliente a la sala del anuncio
        socket.on('join-chat', async (adId) => {
            const product = await Product.findById(adId);
            if (!product) {
                console.error('Anuncio no encontrado');
                return;
            }

            
            const productName = product.name; // Nombre del producto
            socket.join(adId); // Unir al cliente a la sala del anuncio
            console.log(`Usuario ${userId} se unió al chat del anuncio ${adId}`);

            // Enviar historial de mensajes al cliente, incluyendo el nombre del producto
            const messages = await Message.find({ adId }).sort({ createdAt: 1 });
            socket.emit('chat-history', { messages, productName });
        });

        // Escuchar mensajes del cliente
        socket.on('chat-message', async ({ text, adId }) => {
            try {
                if (!text || !adId || !userId) {
                    console.error('Datos inválidos para el mensaje');
                    return;
                }

                // Obtener el nombre del usuario desde la base de datos
                const user = await User.findById(userId);
                const userName = user ? user.name : 'Usuario desconocido';

                // Guardar el mensaje en la base de datos
                const message = new Message({ text, userId, adId });
                await message.save();

                // Emitir el mensaje a todos los clientes conectados a la sala del anuncio
                io.to(adId).emit('chat-message', { text, userName, createdAt: message.createdAt});
            } catch (error) {
                console.error('Error al procesar el mensaje:', error);
            }
        });

        // Manejar desconexión
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
}