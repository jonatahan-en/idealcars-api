import session from "express-session";
import Product from "../models/Products.js";
import { body, validationResult } from "express-validator";

export async function Contact(req, res , next){
    console.log("Datos de sesión en Contact:", req.session);
    try {
        const productId = req.query.productId;
        console.log("ID del producto consultado:", productId);
        
        const product = await Product.findById(productId).populate('owner');
        if (!product) {
            console.error("Producto no encontrado con ID:", productId);
            return res.status(404).send('Producto no encontrado');
        }
        
        console.log("Producto encontrado:", {
            name: product.name,
            brand: product.brand,
            model: product.model,
            owner: product.owner.email
        });
        
        res.render('email', {
            product,
            errors: {},          
            content: ''         
        });
    } catch (error) {
        console.error("Error en Contact:", error);
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
    
    console.log("Validación de contexto:", errors.isEmpty() ? "Sin errores" : errors.mapped());
  
    if (!errors.isEmpty()) {
      return res.render('email',{
         product: await Product.findById(req.body.productId).populate('owner'),
          errors: errors.mapped(),
          content: req.body.content || ''
      })
    }
    
    next();
  }


export async function PostMail(req, res, next) {
    try {
        console.log("Formulario recibido en PostMail:", req.body);
        console.log("Datos de sesión en PostMail:", {
            userId: req.session.userId,
            userName: req.session.userName,
            username: req.session.username,
            userEmail: req.session.userEmail
        });
        
        // Obtener datos necesarios
        const fromUser = req.session.userName; 
        const fromEmail = req.session.userEmail; // Email del remitente
        
        console.log("Email del remitente:", fromEmail);
        console.log("Nombre formateado del remitente:", fromUser);
        
        const content = req.body.content;
        const productId = req.body.productId;
        
        // Buscar el producto y su dueño
        const product = await Product.findById(productId).populate('owner');
        
        if (!product) {
            console.error("Producto no encontrado en PostMail con ID:", productId);
            return res.status(404).send('Producto no encontrado');
        }
        
        // Crear un asunto adecuado con la marca y modelo del coche
        const subject = `Consulta sobre ${product.brand} ${product.model}`;
        console.log("Asunto del email:", subject);
        
        // Enviar el email usando el email del usuario como remitente
        await product.owner.sendEmailBetweenUsers(fromEmail, product.owner.email, subject, content);
        
        console.log("Email enviado correctamente a:", product.owner.email);
        
        // Redirigir o mostrar página de éxito
        return res.render('email', {
            product,
            errors: {},
            content: '',
            success: 'Tu mensaje ha sido enviado correctamente'
        });
    } catch (error) {
        console.error("Error al enviar email:", error);
        next(error);
    }
}