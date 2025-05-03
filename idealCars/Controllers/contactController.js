import session from "express-session";
import Product from "../models/Products.js";
import { body, validationResult } from "express-validator";

export async function Contact(req, res , next){

    try {
        
        const productId = req.query.productId;
        const product = await Product.findById(productId).populate('owner');
       
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('email', {
            product,
            errors: {},          
            content: ''         
          });
    } catch (error) {
        next(error);
    }
}

export async function ValidateContext(req, res,next) {
        
    await body('content')
    .notEmpty().withMessage("El mensaje es obligatorio")
    .trim()
    .isLength({ min: 5 , max: 300 }).withMessage('Debe tener como mínimo 5 caracteres y máximo 300')
    .matches(/^[a-zA-Z0-9 \-.áéíóúÁÉÍÓÚñÑ,$€]+$/).withMessage("Usa solo letras, números, espacios, comas, puntos o €. Ej: '20,50 €'")
    .escape()
    .run(req)


  

    const errors = validationResult(req)

  
    if (!errors.isEmpty()) {
      return res.render('email',{
         product: await Product.findById(req.body.productId).populate('owner'),
          errors: errors.mapped(),
          content: req.body.content || ''
      })
          
         }
    
    next();
  }

export async function PostMail(req,res ,next) {
 console.log("Formulario recibido:", req.body);
 const from = req.session.userEmail
 const content =req.body
 const productId = req.body.productId;
 const product = await Product.findById(productId).populate('owner');
 const subject = product.name
 if (!product) {
    return res.status(404).send('Producto no encontrado');
}

 await product.owner.sendEmailBetweenUsers(from,product.owner.email,subject,content)
 

 res.render('email', {
    product,
    errors: {},        
    content: ''         
  });
}