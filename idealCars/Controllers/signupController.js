import User from '../models/User.js'
import {body, validationResult} from 'express-validator'


export function register (req,res,next){
    res.render('signup', {
        errors: [],
        name:"",
        username:"",
        phone:"",
        email:"",
        password:"",
    })
}

export async function ValidateRegister(req, res,next) {
        
    await body('name')
    .notEmpty().withMessage("El nombre es obligatorio")
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 -]+$/).withMessage('El nombre solo puede contener letras, números y guiones')
    .isLength({ min: 3 , max: 15 }).withMessage('Debe tener como mínimo 3 caracteres y máximo 15')
    .escape()
    .run(req);

    await body('username')
    .notEmpty().withMessage("El username es obligatorio")
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 -]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones')
    .isLength({ min: 3 , max: 15 }).withMessage('Debe tener como mínimo 3 caracteres y máximo 15')
    .escape()
    .run(req);

    await body('email')
    .notEmpty().withMessage('Email requerido')
    .isEmail().withMessage('Debe ser un formato de correo electrónico válido')
    .normalizeEmail()
    .escape()
    .run(req);

    await body('phone')
    .optional({checkFalsy: true})
    .escape()
    .matches(/^[0-9]{3}[0-9]{3}[0-9]{3}$/).withMessage('Number is incorrect it must be in this format 123-123-123')
    .run(req)

    await body('password')
    .notEmpty().withMessage('Must put a password')
    .isLength({min: 8}).withMessage('Password must contains atleast 8 characteres')
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[=@#$])/).withMessage("Debe tener al menos: 8 caracetres, una mayúscula ,una minúscula, un número y uno de estos carácteres especiales: =@#$")
    .run(req)
  
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      return res.render('signup',{
            errors: errors.mapped(),
            name:req.body.name,
            username: req.body.username,
            phone:req.body.phone,
            email:req.body.email,
            password:req.body.password
        })
    }
    next();
  }


export async function postSignup(req,res,next){
    const {username,name ,email, password, phone} = req.body
    
    try {
        
        // asegurarse de que no existe ya un usuario con ese email
        const  ExistingUser = await User.findOne({ 
            email: email.toLowerCase()
            })
            if (ExistingUser) {
                return res.render('signup', {
                    errors: {
                        email: { msg: 'Este email ya está registrado. Por favor, utiliza otro o inicia sesión.' }
                    },
                    name: req.body.name || "",
                    username: req.body.username || "",
                    phone: req.body.phone || "",
                    email: req.body.email || "",
                    password: ""
                });
            }       
                
                //añadir este usuario a la base de datos
                const hashedPassword = await User.hashPassword(password);

                // Mejor manera: crear objeto userData primero
                const userData = {
                    name: name.toLowerCase(), 
                    username: username.toLowerCase(),
                    email: email.toLowerCase(),
                    password: hashedPassword
                };
                    
                // Añadir el teléfono solo si se ha proporcionado
                if (phone) {
                    userData.phone = phone;
                }
                    
                const newUser = await User.create(userData);
                
             //newUser.sendEmail('Bienvenido','Bienvenido a IdealCars')//Si quito el await se elimina la espera,pero es una practica rudimentaria
                return res.redirect('/login');
            } catch (error) {
                console.error('error al crear el usuario:', error);

                // Mensaje de error más específico según el tipo de error
                let errorMessage = 'Error al crear la cuenta. Por favor, inténtalo de nuevo.';
                
                if (error.name === 'ValidationError') {
                    errorMessage = 'Error de validación: ' + Object.values(error.errors).map(e => e.message).join(', ');
                } else if (error.code === 11000) {
                    errorMessage = 'Este email o nombre de usuario ya está en uso.';
                } else {
                    errorMessage = 'Error desconocido: ' + error.message;
                }
        
                // Importante: pasar todas las variables necesarias para que la plantilla funcione
                return res.status(500).render('signup', {
                    errors: {
                        general: { msg: errorMessage }
                    },
                    name: req.body.name || "",
                    username: req.body.username || "",
                    phone: req.body.phone || "",
                    email: req.body.email || "",
                    password: ""
                });
            }
}