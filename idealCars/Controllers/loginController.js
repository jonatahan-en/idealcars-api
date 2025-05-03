import User from '../models/User.js'


export function getlogin(req,res, next){
    res.render('login', {
        errors: [],
        email:"",
        password:""
    }
        
    )
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
        
        // Capitaliza el nombre antes de guardarlo en sesión
        req.session.userName = user.name.replace(/\b\w/g, l => l.toUpperCase())
        req.session.userEmail = user.email

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