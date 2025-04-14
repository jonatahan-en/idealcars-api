import express from 'express';
import logger from 'morgan'
import * as homeController from './controllers/homeController.js'
import connectMongoose from './lib/connectMongoose.js';
import * as loginController from './controllers/loginController.js'
import * as sessionManager from './lib/sessionManager.js'
import * as signupController from './controllers/signupController.js'


await connectMongoose()
console.log("Conectado a MongoDB")
const app = express();



app.set('views', 'views') // views folder
app.set('view engine' , 'ejs')

app.use(logger('dev'))//enseña logs en la consola de las peticiones que hagamos
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
//conexion a la base de datos

/**
 * Website routes
 */
//
app.use(sessionManager.middleware , sessionManager.useSessionInViews)

//public pages 

app.get('/', homeController.index)
//rutas signup
app.get('/signup',signupController.register )
app.post('/signup',signupController.ValidateRegister, signupController.postSignup)
//rutas login
app.get('/login',loginController.getlogin)
app.post('/login',loginController.PostLogIn)
app.all('/logout', loginController.logout)// .all para peticiones get y post()


//error handler
app.use((err, req, res , next) => {
    res.status(err.status || 500);
    res.send("ocurrio un error" + err.message);
})

export default app;