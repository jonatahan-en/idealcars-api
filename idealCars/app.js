import express from 'express';
import connectMongoose from './lib/connectMongoose.js';
import createError from 'http-errors';
import logger from 'morgan';



//conexion a la base de datos
await connectMongoose()
console.log("Conectado a mongoDB")

//inicializar express
const app = express();

// respuestas y peticiones customizadas en la terminal
app.use(logger("dev"));


app.get("/", (req, res, next) => {
    res.send("Hello World!");
});

//catch 404 errors and forward to error handler
app.use((req, res, next) => {
    next(createError(404, "Not Found"));
});


//error handler
app.use((err, req, res , next) => {
    res.status(err.status || 500);
    res.send("ocurrio un error : " + err.message);
})

export default app;