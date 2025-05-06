import User from '../models/User.js'
import {body, validationResult} from 'express-validator'



export function getlogin(req,res, next){
    res.render('login', {
        errors: [],
        email:"",
        password:"",
        redirectMessage: req.query.from === 'newad' 
            ? 'Debes iniciar sesión para crear anuncios' 
            : undefined

    }
        
    )
}
export async function ValidateLogin(req, res,next) {
        
    // Validamos el campo 'name' asegurándonos de que no esté vacío
   


    await body('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid Credentials')
    .normalizeEmail()
    .escape()
    .run(req)

    
    await body('password')
    .notEmpty().withMessage('Email and Password Required')
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[=@#$])/).withMessage('Invalid Credentials')
    .isLength({ min: 8 }).withMessage('Invalid Credentials')
    .run(req)

   
    const errors = validationResult(req)
  
    // Si hay errores de validación, respondemos con el código 400 y los errores.
    if (!errors.isEmpty()) {
      return res.render('login',{
            errors: errors.mapped(),
            email: req.body.email,
            password:req.body.password
         })
    }
    next();
  }


export async function PostLogIn(req,res,next){
    try {
        const {email, password} = req.body

        const user = await User.findOne({email: email.toLowerCase()})
        if(!user || !(await user.comparePassword(password))){  
            
            
              return res.render('login', {
                errors: {
                    auth: { msg: 'Credenciales inválidas. Por favor, verifica tu email y contraseña' }
                },
                email: req.body.email,
                password: ''  // Por seguridad no devolvemos la contraseña
            });
            
            
            
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