import User from "../models/User.js";
import { body, validationResult } from "express-validator";

export function getlogin(req,res, next){
    res.render('login', {
        errors: [],
        username:"",
        password:"",
        redirectMessage: req.query.from === 'newad' 
            ? 'Debes iniciar sesión para crear anuncios' 
            : undefined

    }
        
    )
}
export async function ValidateLogin(req, res,next) {
        
   
   


    await body('username')
    .notEmpty().withMessage("El username es obligatorio")
    .trim()
    .custom(value => !value.includes('@')).withMessage('Invalid Credentials')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 -]+$/).withMessage('Invalid Credentials. Recuerda el formato')
    .isLength({ min: 3 , max: 15 }).withMessage('Invalid Credentials. Recuerda la longitud')
    .escape()
    .run(req),

    
    await body('password')
    .notEmpty().withMessage('Username and Password Required')
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[=@#$])/).withMessage('Invalid Credentials')
    .isLength({ min: 8 }).withMessage('Invalid Credentials')
    .run(req)

   
    const errors = validationResult(req)
  
    // Si hay errores de validación, respondemos con el código 400 y los errores.
    if (!errors.isEmpty()) {
      return res.render('login',{
            errors: errors.mapped(),
            username: req.body.username,
            password:req.body.password
         })
    }
    next();
  }


export async function PostLogIn(req,res,next){
    try {
        const {username, password} = req.body

        const user = await User.findOne({username: username.toLowerCase()})
        if(!user || !(await user.comparePassword(password))){  
            
            return res.render('login', {
                errors: { 
                    password: { 
                        msg: 'Invalid Credentials' ,
                       
                    } 
                },
                username: '', 
                password: ''
            });
            
        }

        

        req.session.userId = user._id
        req.session.userName = user.name.replace(/\b\w/g, l => l.toUpperCase())
        req.session.username = user.username
        req.session.userEmail = user.email

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).render("login");
  }
}
export function logout(req, res, next) {
  req.session.regenerate((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}
