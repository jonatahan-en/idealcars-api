import Product from "../models/Products.js";
import createError from "http-errors";

export async function userProducts(req, res, next) {
    try {
        const userId = req.session.userId;


        const filter = { owner: userId };
        const limit = parseInt(req.query.limit, 10) || 8;
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

export async function deleteProduct(req, res, next) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        const product = await Product.findOne({ _id: id});
        if(!product){
            console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto inexistente`)
            return next(createError(404))
        }
        if (product.owner.toString() !== userId) {
            console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto de otro usuario`)
            return next(createError(401))
        }
        
        await Product.deleteOne({ _id: id });

        res.redirect("/myproducts");
    } catch (error) {
        console.error(`ERROR - ocurrio un error al eliminar el producto ${error}`);
        next(error);
    }
}
export async function editProductForm(req, res, next) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;

        // Busca el producto del usuario autenticado
        const product = await Product.findOne({ _id: id, owner: userId });
        if (!product) {
            console.warn(`WARNING - el usuario ${userId} está intentando editar un producto inexistente`);
            return next(createError(404, "Producto no encontrado"));
        }

        // Renderiza el formulario de edición con los datos del producto
        res.render("editProduct", { product });
    } catch (error) {
        console.error(`ERROR - Ocurrió un error al cargar el formulario de edición: ${error}`);
        next(error);
    }
}
export async function updateProduct(req, res, next) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        const updatedData = req.body;

        // Busca y actualiza el producto del usuario autenticado
        const product = await Product.findOneAndUpdate(
            { _id: id, owner: userId }, // Filtro
            updatedData,                // Datos actualizados
            { new: true }               // Devuelve el producto actualizado
        );

        if (!product) {
            console.warn(`WARNING - el usuario ${userId} está intentando actualizar un producto inexistente`);
            return next(createError(404, "Producto no encontrado"));
        }

        // Redirige a la lista de productos
        res.redirect("/myproducts");
    } catch (error) {
        console.error(`ERROR - Ocurrió un error al actualizar el producto: ${error}`);
        next(error);
    }
}
