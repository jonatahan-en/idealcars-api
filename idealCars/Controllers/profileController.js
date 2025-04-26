import User from "../models/User.js"
import Product from "../models/Products.js";

export async function getProfile(req,res,next){
    
    const userId = req.session.userId
try {
    const user = await User.findOne({ _id: userId });  
    if (!user) {
        return res.status(404).redirect('/');
    }
    return res.render('profile')
} catch (error) {
    console.error(error);
    res.status(500).render('500');
}
}

export async function UpdateProfile(req,res,next){
    const userId = req.session.userId
  

    try {


        const userUpdate = await User.findOneAndUpdate(
        {_id:userId},
        {name: req.body.name,  email: req.body.email},
        {new:true} );  

        if (!userUpdate) {
            return res.status(404).render('/');
        }
            res.status(200).render('/')
       
        
    } catch (error) {
        console.error(error);
        res.status(500).render('error');
    }

}

export async function DeleteProfile(req,res,next){
    const userId = req.session.userId  

    try {
        const user = await User.findOne({ _id: userId });  
        if (!user) {
            return res.status(404).render('profile');
        }
        else{
            await Product.deleteMany({ owner: user._id });    

            await User.deleteOne({_id :userId}) 
        }
        return res.status(200).redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).render('error');
    }
}
