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
            try {
                const product = await Product.findById(adId);
                if (!product) {
                    console.error('Anuncio no encontrado');
                    return;
                }

                const isOwner = product.owner.toString() === userId;

                // Validar que el usuario sea el propietario o un interesado válido
                if (!isOwner) {
                    const interestedUser = await User.findById(userId); // Verifica si el usuario existe
                    if (!interestedUser) {
                        console.error('Usuario no válido');
                        return;
                    }
                }
                // Permitir que el propietario o el interesado se unan al canal
                const productName = product.name; // oducto
                const roomId = `chat-${adId}`; // Sala única para el anuncio
                socket.join(roomId); // Unir al cliente a la sala del anuncio
                console.log(`Usuario ${userId} se unió al chat del anuncio ${adId}`);

                // Enviar historial de mensajes al cliente
                const messages = await Message.find({ adId }).sort({ createdAt: 1 });
                socket.emit('chat-history', { messages, productName, isOwner });
            } catch (error) {
                console.error('Error al unirse al chat:', error);
            }
        });

        // Escuchar mensajes del cliente
        socket.on('chat-message', async ({ text, adId }) => {
            try {
                if (!text || !adId || !userId) {
                    console.error('Datos inválidos para el mensaje');
                    return;
                }

                const product = await Product.findById(adId);
                if (!product) {
                    console.error('Anuncio no encontrado');
                    return;
                }

                const isOwner = product.owner.toString() === userId;

                // Validar que al menos uno de los usuarios sea el propietario
                const roomId = `chat-${adId}`;
                const socketsInRoom = await io.in(roomId).fetchSockets();
                const ownerInRoom = socketsInRoom.some(
                    (s) => s.request.session.userId === product.owner.toString()
                );

                if (!isOwner && !ownerInRoom) {
                    console.error('Ninguno de los usuarios en el chat es el propietario');
                    return;
                }

                // Obtener el nombre del usuario desde la base de datos
                const user = await User.findById(userId);
                const userName = user ? user.name : 'Usuario desconocido';

                // Guardar el mensaje en la base de datos
                const message = new Message({ text, userId, adId });
                await message.save();

                // Emitir el mensaje a todos los clientes conectados a la sala
                io.to(roomId).emit('chat-message', { text, username, createdAt: message.createdAt });
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