import Product from '../models/Products.js';
import {param, validationResult} from 'express-validator';
// middleware para validar el id del anuncio
export const validateAdId = [
    param('adId').isMongoId().withMessage('ID de anuncio inválido')
];


export async function renderChat(req, res, next) {
    try {
        // Validar los datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // Obtener el ID del anuncio y el ID del usuario de la sesión
        
        const adId = req.params.adId;
        const userId = req.session.userId;
        
        // Verificar si el anuncio existe
        const product = await Product.findById(adId);
        if (!product) {
            return res.status(404).send('Anuncio no encontrado');
        }
        const isOwner = product.owner.toString() === userId;

        const isInterested = true; 
        if (!isOwner && !isInterested) {
            return res.status(403).send('No tienes permiso para acceder a este chat');
        }
        // si el usuario no es el propietario y está interesado, verificar si el propietario está disponible para el chat
        if (!isOwner && isInterested) {
            const ownerId = product.owner.toString();
            if (!ownerId) {
                return res.status(403).send('El propietario del anuncio no está disponible para el chat');
            }
        }
        
        const productName = product.name; 

        // Renderizar la vista del chat con el nombre del producto
        res.render('chat', { adId, userId, productName });
    } catch (error) {
        next(error);
    }
}