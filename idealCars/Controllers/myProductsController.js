import Product from "../models/Products.js";

export async function userProducts(req, res, next) {
    try {
        const userId = req.session.userId;


        const filter = { owner: userId };
        const limit = parseInt(req.query.limit, 10) || 2;
        const skip = parseInt(req.query.skip, 10) || 0;
        const sort = req.query.sort || "name";

        // Obtén los productos del usuario autenticado
        const products = await Product.list(filter, limit, skip, sort);
        const count = await Product.countDocuments(filter);

        // Renderiza la vista de productos del usuario
        res.render("myProduct", { products, count, limit, skip });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

