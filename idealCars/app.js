import express from 'express';
import { EventEmitter } from 'events';
import i18n from './lib/i18nConfigure.js';
import connectMongoose from './lib/connectMongoose.js';
import createError from 'http-errors';
import logger from 'morgan';
import upload from './lib/uploadConfigure.js';
import methodOverride from 'method-override';
//Imports auth
import * as sessionManager from './lib/sessionManager.js';
import * as jwtAuth from './lib/jwtAuthMiddlewere.js';
//Web Imports Controllers
import * as homeController from './controllers/homeController.js';
import * as loginController from './Controllers/loginController.js';
import * as signupController from './Controllers/signupController.js';
import * as signoutController from './Controllers/signoutController.js'
import * as productsController from './Controllers/productController.js';
import * as myProductsController from './Controllers/myProductsController.js';
import * as contactController from './Controllers/contactController.js'

import * as ProfileController from './controllers/profileController.js';
//Api Imports Controllers
import * as apiProductsController from './controllers/api/apiProductsController.js';
import * as ProfileApiController from './controllers/api/user/ProfileApiController.js';
import * as signupApiController from './controllers/api/user/signupApiController.js';
import * as loginApiController from './controllers/api/user/loginApiController.js';

// ================================
// Conexión a la base de datos
// ================================
await connectMongoose();
console.log("Conectado a MongoDB");

// ================================
// Configuración de la aplicación
// ================================
const app = express();


EventEmitter.defaultMaxListeners = 20
// Configuración global de la aplicación
app.locals.appName = "IdealCars"; // Nombre de la aplicación
app.set('lang', 'es'); // Idioma por defecto
app.set('locale', 'es'); // Idioma por defecto
app.set('views', 'views'); // Carpeta de vistas
app.set('view engine', 'ejs'); // Motor de plantillas


// Middlewares globales
app.use(logger('dev')); // Logs de peticiones
app.use(express.json()); // Parseo de JSON
app.use(express.urlencoded({ extended: true })); // Parseo de formularios
app.use(express.static('public')); // Archivos estáticos
app.use(i18n.init); // Configuración de internacionalización
app.use(methodOverride('_method')); // Middleware para métodos HTTP (PUT, DELETE) en formularios



// Middleware para exponer el idioma actual en las vistas (para mostrar banderas y nombre del idioma)
app.use((req, res, next) => {
    res.locals.currentLocale = req.getLocale(); // Hace disponible el idioma actual en las vistas EJS
    next();
});

// Middleware de sesión
app.use(sessionManager.middleware, sessionManager.useSessionInViews);

//================================
// Rutas de la API Productos
//================================

app.get('/api/products',jwtAuth.guard,apiProductsController.apiProductsList);
app.get('/api/products/:id',jwtAuth.guard,apiProductsController.apiProductGetOne); 
app.post('/api/products',jwtAuth.guard,upload.single('image'), apiProductsController.apiProductNew)
app.put('/api/products/:id',jwtAuth.guard,upload.single('image'), apiProductsController.apiProductUpdate)
app.delete('/api/products/:id',jwtAuth.guard,apiProductsController.apiProductDelete)
app.get('/api/user/profile', jwtAuth.guard, ProfileApiController.getProfile);
app.put('/api/user/profile', jwtAuth.guard, ProfileApiController.UpdateProfile);
app.delete('/api/user/profile', jwtAuth.guard, ProfileApiController.DeleteProfile);
app.post('/api/user/signup', signupApiController.ApipostSignup)
app.post('/api/user/login', loginApiController.loginJWT)

// ================================
// Rutas públicas
// ================================
app.get('/', homeController.index); // Página de inicio

app.get('/signup', signupController.register); // Página de registro
app.post('/signup', signupController.ValidateRegister, signupController.postSignup); // Registro de usuario
app.get('/login', loginController.getlogin); // Página de login
app.post('/login', loginController.PostLogIn); // Inicio de sesión
app.all('/logout', loginController.logout); // Cierre de sesión

// ================================
// Rutas privadas (requieren autenticación)
// ================================

// rutas de productos
app.get('/myproducts',sessionManager.isLoggedIn, myProductsController.userProducts);
app.delete('/myproducts/delete/:id',sessionManager.isLoggedIn,myProductsController.deleteProduct) 
app.get('/myproducts/edit/:id', sessionManager.isLoggedIn, myProductsController.editProductForm);
app.put('/myproducts/:id', sessionManager.isLoggedIn,myProductsController.validateProduct, myProductsController.updateProduct,);

app.get('/products/new', sessionManager.isLoggedIn, productsController.index); 
app.post(
    '/products/new',
    sessionManager.isLoggedIn,
    upload.single('image'),
    productsController.validateProduct,
    productsController.postNew,
); 
app.get('/products/detail/:id', sessionManager.isLoggedIn,productsController.detail);//conflicto:no puede estar por encima de new
// Paths user privates
app.get('/signout' ,sessionManager.isLoggedIn , signoutController.unregister)
app.post('/signout' ,sessionManager.isLoggedIn, signoutController.unsuscribe)
app.get('/profile',sessionManager.isLoggedIn, ProfileController.getProfile)
app.put('/profile',sessionManager.isLoggedIn, ProfileController.UpdateProfile)
app.delete('/profile',sessionManager.isLoggedIn, ProfileController.DeleteProfile)
app.get('/email', sessionManager.isLoggedIn, contactController.Contact)
app.post('/email', sessionManager.isLoggedIn ,contactController.ValidateContext, contactController.PostMail)


// ================================
// Manejo de errores
// ================================


// Error 404
app.use((req, res, next) => {
    next(createError(404));
});

// Error general
app.use((err, req, res, next) => {
    res.status(err.status || 500);

//API Error
if(req.url.startsWith("/api/")){
    res.json({ error:err.message })
    return
}

    res.locals.message = err.message;
    res.locals.error = process.env.NODECARS_ENV === "development" ? err : {};
    res.render("error");
});

// ================================
// Exportación de la aplicación
// ================================

export default app;