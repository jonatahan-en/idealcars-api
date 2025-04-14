import Product from "../models/Products.js" 

export async function index (req, res, next){
    res.locals.products = await Product.find() 
    res.render("home")
} 

