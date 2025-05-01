import User from '../models/User.js'
import {body, validationResult} from 'express-validator'


export function register (req,res,next){
    res.render('signup')
}

export async function validateUser(req, res, next) {
    console.log("Datos recibidos", req.body)

    await body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras')
    .isLength({min: 3}).withMessage('El nombre debe tener al menos 3 caracteres')
    .escape()
    .run(req)
    
   
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log("Errores de validación", errors.array())
        return res.render('signup', {
            errors: errors.mapped(),
                name: req.body.name,
               
        })
    }
    next()
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


//testeo una validacion con express validator

export async function ValidateRegister(req, res,next) {
    
    // Validamos el campo 'name' asegurándonos de que no esté vacío
    await body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
    .run(req)


    await body('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Must be a valid email format')
    .normalizeEmail()
    .run(req);

    await body('phone')
    .optional({checkFalsy: true})
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/).withMessage('Number is incorrect it must be in this format 123-123-123')
    .run(req);


    await body('password')
    .notEmpty().withMessage('Must put a password')
    .isLength({min: 4}).withMessage('Password must contains atleast 4 characteres')
    .run(req);
  
    // Usamos validationResult para obtener los errores de validación
    const errors = validationResult(req)
  
    // Si hay errores de validación, respondemos con el código 400 y los errores.
    if (!errors.isEmpty()) {
      return res.render('signup',{
            errors: errors.array(),
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            password:req.body.password
         })


    }


    next();
  }
  
