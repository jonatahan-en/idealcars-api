import User from '../models/User.js'


export function getlogin(req,res, next){
    res.render('login')
}

export async function PostLogIn(req,res,next){
    try {
        const {email, password} = req.body

        const user = await User.findOne({email: email.toLowerCase()})
        if(!user || !(await user.comparePassword(password))){  
            res.render('login')
            return
        }

        
        // si el usuario existe y la contraseña es correcta --> apuntar en su sesión que está loggado.

        req.session.userId = user._id
        req.session.userName = user.email

        res.redirect('/')

    } catch (error) {
        console.error(error);
        res.status(500).render('login');
    }


}
export function logout(req,res,next){
    req.session.regenerate(err=>{
        if(err) return next(err)
        res.redirect('/')
    })
}