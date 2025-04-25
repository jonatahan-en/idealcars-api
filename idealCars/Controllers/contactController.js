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
   
 await newUser.sendEmailBetweenUsers()
}