import e from "express"
import  Product  from "../models/Products.js"
import {body, validationResult} from "express-validator"


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
    console.log(req.body)
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
    await  body('color')
    .notEmpty().withMessage('El color es obligatorio')
    .isLength({min: 3}).withMessage('El color debe tener al menos 3 caracteres')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El color solo puede contener letras')
    .run(req),
    await  body('year')
    .notEmpty().withMessage('El año es obligatorio')
    .isNumeric().withMessage('El año debe ser un número')
    .run(req),
    await body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isNumeric().withMessage('El precio debe ser un número')
    .run(req),
    await body('kilometer')
    .notEmpty().withMessage('El kilometraje es obligatorio')
    .isNumeric().withMessage('El kilometraje debe ser un número')
    .run(req)
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.render('new-product', {
            errors: errors.array(),
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

        const userId = req.session.userId

        const {name,model,color,year,price,kilometer,image} = req.body
        console.log(req.body)
        console.log(req.file)
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
        await product.save()
        res.redirect('/')
        
    } catch (error) {
        next(error)
    }
}

