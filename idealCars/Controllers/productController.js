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
        images: [],
    })
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
        "ibiza", "giulia", "swift", "c4", "charger", "300c","c3"
      ];
    const coloresValidos= ['rojo', 'azul','verde','amarillo','celeste','rosa','negro','plateado','gris','blanco','morado','naranja','marron'];
    
    await body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras')
    .custom( value => {
        if(!marcas.includes(value.toLowerCase())){
            const ejemplos = ["toyota", "ford", "volkswagen", "honda", "bmw"];
            throw new Error(
                `Marca no reconocida. Ejemplos válidos: ${ejemplos.join(', ')}. ` +
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
    .custom( value => {
        if(!modelos.includes(value.toLowerCase())){
            throw new Error(`Este modelo no está disponible aún. Por favor contacte con:  idealcarsapiwankenobi@gmail.com.`)
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
        return res.render('new-product', {
            errors: errors.mapped(),
                name: req.body.name,
                model: req.body.model,
                color: req.body.color,
                year: req.body.year,
                price: req.body.price,
                kilometer: req.body.kilometer,
                images: []
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
        const images = req.files ? req.files.map(file => file.filename) : [];
        //Validaciones
        const product = new Product({
            name,
            model,
            color,
            year,   
            price,
            kilometer,
            images, 
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

