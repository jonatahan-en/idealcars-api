import User from '../models/User.js'
import {body, validationResult} from 'express-validator'


export function register (req,res,next){
    res.render('signup', {
        errors: [],
        name:"",
        phone:"",
        email:"",
        password:"",
    })
}
//testeo una validacion con express validator
    
export async function ValidateRegister(req, res,next) {
        
    // Validamos el campo 'name' asegurándonos de que no esté vacío
    await body('name')
    .notEmpty().withMessage("El nombre es obligatorio")
    .trim()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras')
    .isLength({ min: 3 , max: 10 }).withMessage('Debe tener como mínimo 3 caracteres y máximo 10')
    .escape()
    .run(req),


    await body('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Must be a valid email format')
    .normalizeEmail()
    .escape()
    .run(req),

    await body('phone')
    .optional({checkFalsy: true})
    .escape()
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/).withMessage('Number is incorrect it must be in this format 123-123-123')
    .run(req),

    await body('password')
    .notEmpty().withMessage('Must put a password')
    .isLength({min: 8}).withMessage('Password must contains atleast 8 characteres')
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[=@#$])/).withMessage("Debe tener al menos: 8 caracetres, una mayúscula ,una minúscula, un número y uno de estos carácteres especiales: =@#$")
    .run(req)
  
    // Usamos validationResult para obtener los errores de validación
    const errors = validationResult(req)
  
    // Si hay errores de validación, respondemos con el código 400 y los errores.
    if (!errors.isEmpty()) {
      return res.render('signup',{
            errors: errors.mapped(),
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            password:req.body.password
         })
    }
    next();
  }


export async function postSignup(req,res,next){
    const {name ,email, password} = req.body
    
    try {
        
        // asegurarse de que no lo esta ya
        const  ExistingUser = await User.findOne({ 
            email: email.toLowerCase()
            })
            if(ExistingUser){
                return res.redirect('/login')
                 //enviar un email al usuario
                 
                }    
                
                //añadir este usuario a la base de datos
                const hashedPassword = await User.hashPassword(password);
                const NewUser = await User.create({
                    name: name.toLowerCase(), 
                    email: email.toLowerCase(),
                    password: hashedPassword,
                })
                
            await NewUser.sendEmail('Bienvenido','Bienvenido a IdealCars')//Si quito el await se elimina la espera,pero es una practica rudimentaria
            res.redirect('/login')
    } catch (error) {
        console.error(error);
        res.status(500).render('signup');
    }
        //si los datos no cumples los requerimientos render signup de nuevo
        
        //comprobando el nombre , el id o los campos correspondientes
        //}
    }

    

  
