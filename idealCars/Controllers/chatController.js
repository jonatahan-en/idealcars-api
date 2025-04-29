import Product from '../models/Products.js';
// import Message from '../models/Message.js';

export async function renderChat(req, res, next) {
    try {
        const adId = req.params.adId;
        const userId = req.session.userId;

        // Verificar si el anuncio existe
        const product = await Product.findById(adId);
        if (!product) {
            return res.status(404).send('Anuncio no encontrado');
        }

        const productName = product.name; 

        // Renderizar la vista del chat con el nombre del producto
        res.render('chat', { adId, userId, productName });
    } catch (error) {
        next(error);
    }
}
