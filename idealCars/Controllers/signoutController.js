import User from '../models/User.js'
import Product from '../models/Products.js'

export function unregister (req,res,next){
    res.render('signout')
}

export async function unsuscribe(req,res,next){
    
    try {
        const {email, password} = req.body
        
      //comprobamos que el usuario existe
        const user = await User.findOne({email:email.toLowerCase()})
        if(!user || !(await user.comparePassword(password))){  
            res.render('signout')
            return
        }
        else{
            await Product.deleteMany({ owner: user._id });    

            await User.deleteOne({email: email.toLowerCase()})    
                res.redirect('/')
        }

  
    } catch (error) {
        console.error(error);
        res.status(500).render('signout');
    }
}