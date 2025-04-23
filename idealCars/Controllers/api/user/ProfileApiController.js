import User from "../../../models/User.js"
import Product from "../../../models/Products.js";

export async function getProfile(req,res,next){
    
    const userId = req.apiUserId;  
try {
    const user = await User.findOne({ _id: userId });  
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({
        user: {
            name: user.name,
            email: user.email,
        }
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
}
}

export async function UpdateProfile(req,res,next){
    const userId = req.apiUserId;  
    const profilename = req.body.name
    const email = req.body.email

    try {


        const userUpdate = await User.findOneAndUpdate(
        { _id: userId},
        {name: profilename, email: email},
        {new:true} );  

        if (!userUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }
            res.status(200).json({result: userUpdate})
       
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

}

export async function DeleteProfile(req,res,next){
    const userId = req.apiUserId;  

    try {
        const user = await User.findOne({ _id: userId });  
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        else{
            await Product.deleteMany({ owner: user._id });    

            await User.deleteOne({_id :userId}) 
        }
        return res.status(200).json({success: 'Usuario borrado '});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}