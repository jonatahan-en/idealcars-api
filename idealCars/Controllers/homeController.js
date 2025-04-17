import Product from "../models/Products.js" 

export async function index (req, res, next){

    const userId = req.session.userId
    if(userId){
    res.locals.products = await Product.find({ owner: userId }) 
    }
    res.render("home")
} 