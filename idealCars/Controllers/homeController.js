import Product from "../models/Products.js";

export async function index(req, res, next) {
    try {
        const filterBrand = req.query.brand;
        const filterModel = req.query.model;
        const filterColor = req.query.color;
        const filterYear = req.query.year;
        const filterPrice = req.query.price;
        const filterKilometer = req.query.kilometer;
        const limit = parseInt(req.query.limit, 10) || 4; // 4 productos por página
        const skip = parseInt(req.query.skip, 10) || 0;
        const sort = req.query.sort || "brand"; // Ordenar por marca por defecto

        const filter = {}; // Sin filtro de usuario, muestra todos los productos

        if (filterBrand) {
            filter.brand = { $regex: filterBrand, $options: "i" };
        }
        if (filterModel) {
            filter.model = { $regex: filterModel, $options: "i" };
        }
        if (filterColor) {
            filter.color = { $regex: filterColor, $options: "i" };
        }
        if (filterYear) {
            const year = parseInt(filterYear, 10);
            if (!isNaN(year)) {
                filter.year = year;
            }
        }
        if (filterPrice) {
            const price = parseInt(filterPrice, 10);
            if (!isNaN(price)) {
                filter.price = price;
            }
        }
        if (filterKilometer) {
            const kilometer = parseInt(filterKilometer, 10);
            if (!isNaN(kilometer)) {
                filter.kilometer = kilometer;
            }
        }

        // Verifica que el valor de ordenación exista en el esquema para evitar errores
        if (!['brand', 'model', 'year', 'price', 'kilometer'].includes(sort)) {
            sort = 'brand'; // Si se pasa un campo no válido, usa 'brand' por defecto
        }
    
        const products = await Product.list(filter, limit, skip, sort);
        const count = await Product.countDocuments(filter);

        res.render("home", { products, count, limit, skip, sort });
    } catch (error) {
        console.error(error);
        next(error);
    }
}