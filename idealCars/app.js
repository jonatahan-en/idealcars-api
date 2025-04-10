import express from 'express';
import connectMongoose from './lib/connectMongoose.js';
import createError from 'http-errors';
import logger from 'morgan';

//conexion a la base de datos
await connectMongoose()
console.log("Conectado a mongoDB")
const app = express();

// crea un ana respuesta custon en el terminal
app.use(logger("dev"));

app.get("/", (req, res, next) => {
    res.send("Hello World!");
});

//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});


//error handler
app.use((err, req, res , next) => {
    res.status(err.status || 500);
    res.send("ocurrio un error" + err.message);
})

export default app;