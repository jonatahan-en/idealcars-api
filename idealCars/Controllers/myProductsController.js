import Product from "../models/Products.js";
import createError from "http-errors";
import {body , validationResult} from "express-validator"

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

        // Preparar los datos para la plantilla, mapeando brand a name
        const productForTemplate = {
            _id: product._id,
            name: product.brand, // Asignamos brand a name para la vista
            model: product.model,
            color: product.color,
            year: product.year,
            price: product.price,
            kilometer: product.kilometer,
            images: product.images || [] // Incluimos las imágenes
        };

        // Renderiza el formulario de edición con los datos del producto
        res.render("editProduct", { product: productForTemplate });
    } catch (error) {
        console.error(`ERROR - Ocurrió un error al cargar el formulario de edición: ${error}`);
        next(error);
    }
}
export async function validateProduct(req, res, next) {
    console.log("Datos recibidos", req.body)

    const marcas = [
        "toyota", "ford", "volkswagen", "honda", "bmw", "mercedes-benz", 
        "audi", "hyundai", "chevrolet", "nissan", "kia", "peugeot", 
        "renault", "mazda", "subaru", "lexus", "tesla", "fiat", 
        "volvo", "jeep", "mitsubishi", "land rover", "jaguar", 
        "skoda", "seat", "alfa romeo", "suzuki", "citroen", "dodge", "chrysler","ferrari"
      ];
    const modelos = [
        "corolla", "f-150", "golf", "civic", "serie 3", "clase c", 
        "a4", "elantra", "silverado", "altima", "sportage", "208", 
        "clio", "cx-5", "outback", "rx 350", "model 3", "panda", 
        "xc60", "wrangler", "lancer", "discovery", "xf", "octavia", 
        "ibiza", "giulia", "swift", "c4", "charger", "300c", "c3", "focus"
      ];
    const coloresValidos= ['rojo', 'azul','verde','amarillo','celeste','rosa','negro','plateado','gris','blanco','morado','naranja','marron'];
    
    await body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isAlpha('es-ES', { ignore: ' -' }).withMessage('El nombre solo puede contener letras')
    .custom(value => {
        // Convertimos el valor a minúscula para comparar sin distinción de mayúsculas/minúsculas
        const valorLowerCase = value.toLowerCase();
        // Comprobamos si el valor está en el array de marcas
        if(!marcas.includes(valorLowerCase)){
            const ejemplos = ["Toyota", "Ford", "Volkswagen", "Honda", "BMW"];
            throw new Error(
                `Esta marca no está disponible aún. Ejemplos válidos: ${ejemplos.join(', ')}. ` +
                `Contacto: idealcarsapiwankenobi@gmail.com`
            );
        }
        return true
    })
    .isLength({min: 3}).withMessage('El nombre debe tener al menos 3 caracteres')
    .escape()
    .run(req),
    await body('model')
    .notEmpty().withMessage('El modelo es obligatorio')
    .isLength({min: 2}).withMessage('El modelo debe tener al menos 2 caracteres')
    .trim()
    .matches(/^[a-zA-Z0-9 \-.]+$/).withMessage()
    .isAlpha('es-ES', { ignore: ' -.0123456789' }).withMessage('Solo letras, guiones y puntos')
    .custom(value => {
        // Convertimos el valor a minúscula para comparar sin distinción de mayúsculas/minúsculas
        const valorLowerCase = value.toLowerCase();
        // Comprobamos si el valor está en el array de modelos
        if(!modelos.includes(valorLowerCase)){
            throw new Error(`Este modelo no está disponible aún. Por favor contacte con: idealcarsapiwankenobi@gmail.com.`)
        }
        return true
    })
    .escape()
    .run(req),
    await body('color')
    .notEmpty().withMessage('El color es obligatorio')
    .isLength({min: 3}).withMessage('El color debe tener al menos 3 caracteres')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El color solo puede contener letras')
    .custom(value => {
        if (!coloresValidos.includes(value.toLowerCase())) {
            throw new Error(`Color no válido. Opciones : ${coloresValidos.join(', ')}`)
        }
                return true
    })
    .run(req),
    await body('year')
    .notEmpty().withMessage('El año es obligatorio')
    .isNumeric().withMessage('El año debe ser un número')
    .isFloat({min:1980, max: 2024}).withMessage('El rango de años debe ser entre 1980 y 2024')
    .escape()
    .run(req),
    await body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isNumeric().withMessage('El precio debe ser un número')
    .isFloat({min: 300, max:100000}).withMessage('El precio debe ser entre 300 y 100.000 euros')
    .run(req),
    await body('kilometer')
    .notEmpty().withMessage('El kilometraje es obligatorio')
    .isFloat({min:0, max:300000}).withMessage('El kilometraje debe ser un número entre 0 y 300.000Km')
    .isNumeric().withMessage('El kilometraje debe ser un número')
    .escape()
    .run(req)
   
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log("Errores de validación", errors.array())
        return res.render('editProduct', {
            product:{
                _id: req.params.id,
                errors: errors.mapped(),
                name: req.body.name,
                model: req.body.model,
                color: req.body.color,
                year: req.body.year,
                price: req.body.price,
                kilometer: req.body.kilometer,
                image: req.body.image
            }
        })
    }
    next()
}
export async function updateProduct(req, res, next) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        const { name, model, color, year, price, kilometer } = req.body;
        
        // Buscar el producto original para obtener las imágenes existentes
        const originalProduct = await Product.findOne({ _id: id, owner: userId });
        if (!originalProduct) {
            console.warn(`WARNING - el usuario ${userId} está intentando actualizar un producto inexistente`);
            return next(createError(404, "Producto no encontrado"));
        }
        
        // Obtener las imágenes existentes que no se han eliminado (si se envían)
        let existingImages = req.body.existingImages || [];
        if (!Array.isArray(existingImages)) {
            existingImages = [existingImages]; // Convertir a array si solo se envía un valor
        }
        
        // Procesar las nuevas imágenes subidas
        const newImages = req.files ? req.files.map(file => file.filename) : [];
        
        // Combinar las imágenes existentes y nuevas
        const images = [...existingImages, ...newImages];
        
        // Crear un objeto con los datos actualizados
        const updatedData = {
            brand: name, // Asignamos 'name' a 'brand'
            model,
            color,
            year,
            price,
            kilometer,
            images: images.length > 0 ? images : originalProduct.images // Si no hay imágenes, mantener las originales
        };

        console.log("Datos actualizados:", updatedData);
        
        // Busca y actualiza el producto
        const product = await Product.findOneAndUpdate(
            { _id: id, owner: userId },
            updatedData,
            { new: true }
        );

        // Redirige a la lista de productos
        res.redirect("/myproducts");
    } catch (error) {
        console.error(`ERROR - Ocurrió un error al actualizar el producto: ${error}`);
        next(error);
    }
}
