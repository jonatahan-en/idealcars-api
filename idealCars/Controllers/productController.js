import  Product  from "../models/Products.js"
import { body, validationResult } from "express-validator"


export function index(req, res, next) {
    res.render("new-product",{
        errors: [],
        name: "",
        model: "",
        color: "", 
        year: "",
        price: "",
        kilometer: "",
        image: "",
    })
}


export async function validateProduct(req, res, next) {
    console.log("Datos recibidos", req.body)
    
    await body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({min: 4}).withMessage('El nombre debe tener al menos 4 caracteres')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras')
    .run(req),
    await body('model')
    .notEmpty().withMessage('El modelo es obligatorio')
    .isLength({min: 4}).withMessage('El modelo debe tener al menos 4 caracteres')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El modelo solo puede contener letras')
    .run(req),
    await body('color')
    .notEmpty().withMessage('El color es obligatorio')
    .isLength({min: 3}).withMessage('El color debe tener al menos 3 caracteres')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El color solo puede contener letras')
    .run(req),
    await body('year')
    .notEmpty().withMessage('El año es obligatorio')
    .isNumeric().withMessage('El año debe ser un número')
    .run(req),
    await body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isNumeric().withMessage('El precio debe ser un número')
    .run(req),
    await body('kilometer')
    .notEmpty().withMessage('El kilometraje es obligatorio')
    .isInt({min:0}).withMessage('El kilometraje no puede ser negativo')
    .isNumeric().withMessage('El kilometraje debe ser un número')
    .run(req)
   
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log("Errores de validación", errors.array())
        return res.render('new-product', {
            errors: errors.mapped(),
                name: req.body.name,
                model: req.body.model,
                color: req.body.color,
                year: req.body.year,
                price: req.body.price,
                kilometer: req.body.kilometer,
                image: req.body.image
        })
    }
    next()
}

export async function postNew(req, res, next) {
    try {
        console.log("Datos recibidos en postNew:", req.body);  // Verifica los datos recibidos
        console.log("Archivo recibido:", req.file);  // Verifica si se ha subido correctamente un archivo de imagen
        const userId = req.session.userId

        const {name,model,color,year,price,kilometer,image} = req.body
        //Validaciones
        const product = new Product({
            name,
            model,
            color,
            year,   
            price,
            kilometer,
            image: req.file ? req.file.filename : null,
            owner: userId
        })
        console.log("Producto a guardar:", product);
        await product.save()
        res.redirect('/')
        
    } catch (error) {
        console.error("Error al guardar el producto:", error); 
        next(error)
    }
}

// Mostrar detalle de producto

export async function detail(req, res, next) {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('product-detail', {product});
    } catch (error) {
        next(error);
    }
}

