import express from 'express';
import connectMongoose from './lib/connectMongoose.js';
import * as loginController from './Controllers/loginController.js'
import * as signupController from './Controllers/signupController.js'

await connectMongoose()
console.log("Conectado a MongoDB")
const app = express();

app.get("/", (req, res, next) => {
    res.send("Hello World!");
});


app.set('views', 'views') // views folder
app.set('view engine' , 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
//conexion a la base de datos

/**
 * Application routes
 */

//public pages 

//rutas signup
app.get('/signup',signupController.register )
app.post('/signup',signupController.ValidateRegister, signupController.postSignup)
//rutas login
app.get('/login', loginController.getlogin)


//error handler
app.use((err, req, res , next) => {
    res.status(err.status || 500);
    res.send("ocurrio un error" + err.message);
})

export default app;