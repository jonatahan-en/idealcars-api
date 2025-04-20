import express from 'express';
import connectMongoose from './lib/connectMongoose.js';
import createError from 'http-errors';
import logger from 'morgan';
import upload from './lib/uploadConfigure.js';
import * as sessionManager from './lib/sessionManager.js';
import * as homeController from './controllers/homeController.js';
import * as loginController from './controllers/loginController.js';
import * as signupController from './controllers/signupController.js';
import * as signoutController from './Controllers/signoutController.js'
import * as productsController from './controllers/productController.js';
import i18n from './lib/i18nConfigure.js';

// ================================
// Conexión a la base de datos
// ================================
await connectMongoose();
console.log("Conectado a MongoDB");

// ================================
// Configuración de la aplicación
// ================================
const app = express();

// Configuración global de la aplicación
app.locals.appName = "IdealCars"; // Nombre de la aplicación
app.set('port', process.env.PORT || 3000); // Puerto
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

// Middleware para exponer el idioma actual en las vistas (para mostrar banderas y nombre del idioma)
app.use((req, res, next) => {
    res.locals.currentLocale = req.getLocale(); // Hace disponible el idioma actual en las vistas EJS
    next();
});

// Middleware de sesión
app.use(sessionManager.middleware, sessionManager.useSessionInViews);

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
app.get('/products/new', sessionManager.isLoggedIn, productsController.index); // Formulario de nuevo producto
app.post(
    '/products/new',
    sessionManager.isLoggedIn,
        upload.single('image'), // Middleware para subir imágenes
    productsController.validateProduct,
    productsController.postNew
); // Creación de nuevo producto
// paths signout privates
app.get('/signout' ,sessionManager.isLoggedIn , signoutController.unregister)
app.post('/signout' ,sessionManager.isLoggedIn, signoutController.unsuscribe)

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
    res.locals.message = err.message;
    res.locals.error = process.env.NODECARS_ENV === "development" ? err : {};
    res.render("error");
});

// ================================
// Exportación de la aplicación
// ================================

export default app;