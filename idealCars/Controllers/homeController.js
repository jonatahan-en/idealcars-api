import Product from "../models/Products.js" 

export async function index (req, res, next){
    const userId = req.session.userId
    res.locals.products = await Product.find() 
    res.render("home")
} 

