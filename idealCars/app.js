import express from 'express';
import connectMongoose from './lib/connectMongoose.js';
import createError from 'http-errors';
import logger from 'morgan';
import *  as homeControllers from './controllers/homeControllers.js';

//conexion a la base de datos
await connectMongoose()
console.log("Conectado a mongoDB")

const app = express();

app.locals.appName = "Ideal Cars" // nombre de la aplicacion

// extencion y motor para renderizar vistas
app.set("views", "./views"); 
app.set("view engine", "ejs"); 

app.use(logger("dev")); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); // para poder recibir datos de formularios
app.use(express.static("public"));


/**
 * Application Router
 */
app.get("/",homeControllers.index); 





//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
//error handler
app.use((err, req, res , next) => {
    res.status(err.status || 500);
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODECARS_ENV === "development" ? err : {};
    //render the error page
    res.render("error")
})

export default app;