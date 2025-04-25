import session from "express-session";
import Product from "../models/Products.js";

export async function Contact(req, res , next){

    try {
        
        const productId = req.query.productId;
        const product = await Product.findById(productId).populate('owner');
       
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        
        res.render('email',{product});
    } catch (error) {
        next(error);
    }
}

export async function PostMail(req,res ,next) {
 
 const from = req.session.userEmail
 const content =req.body
 const productId = req.body.productId;
 const product = await Product.findById(productId).populate('owner');
 const subject = product.name
 if (!product) {
    return res.status(404).send('Producto no encontrado');
}

 await product.owner.sendEmailBetweenUsers({
    from: from,
    to: product.owner.email,
    subject: subject,
    content: content
 })
 

 res.render('email', {product})
}