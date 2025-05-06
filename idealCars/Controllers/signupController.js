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
    const {name, email, password, phone} = req.body
    
    try {
        
        // asegurarse de que no existe ya un usuario con ese email
        const ExistingUser = await User.findOne({ 
            email: email.toLowerCase()
        });
        
        if(ExistingUser){
            return res.render('signup', {
                errors: {
                    email: { msg: 'Este email ya está registrado. Por favor, utiliza otro o inicia sesión.' }
                },
                name: req.body.name || "",
                phone: req.body.phone || "",
                email: req.body.email || "",
                password: ""
            });
        }    
                
        //añadir este usuario a la base de datos
        const hashedPassword = await User.hashPassword(password);
        
        const userData = {
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword
        };
        
        // Añadir el teléfono solo si se ha proporcionado
        if (phone) {
            userData.phone = phone;
        }
        
        const NewUser = await User.create(userData);
        
        console.log('Usuario creado exitosamente:', NewUser._id);
        
        try {
            await NewUser.sendEmail('Bienvenido a IdealCars', 
                `<h1>¡Bienvenido a IdealCars!</h1>
                <p>Hola ${name},</p>
                <p>Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión y comenzar a explorar nuestra plataforma.</p>
                <p>¡Gracias por registrarte!</p>`);
            console.log('Email de bienvenida enviado');
        } catch (emailError) {
            console.error('Error al enviar email de bienvenida:', emailError);
            // No interrumpimos el flujo por un error en el email
        }
        
        return res.redirect('/login');
    } catch (error) {
        console.error('Error al crear usuario:', error);
        
        // Mensaje de error más específico según el tipo de error
        let errorMessage = 'Error al crear la cuenta. Por favor, inténtalo de nuevo.';
        
        if (error.name === 'ValidationError') {
            errorMessage = 'Error de validación: ' + Object.values(error.errors).map(e => e.message).join(', ');
        } else if (error.code === 11000) {
            errorMessage = 'Este email ya está en uso.';
        }
        
        return res.render('signup', {
            errors: {
                general: { msg: errorMessage }
            },
            name: req.body.name || "",
            phone: req.body.phone || "",
            email: req.body.email || "",
            password: ""
        });
    }
}




