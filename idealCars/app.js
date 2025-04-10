import express from 'express';
import connectMongoose from './lib/connectMongoose.js';

//conexion a la base de datos
await connectMongoose()
console.log("Conectado a mongoDB")

//inicializar express
const app = express();

app.get("/", (req, res, next) => {
    res.send("Hello World!");
});

//conexion a la base de datos


//error handler
app.use((err, req, res , next) => {
    res.status(err.status || 500);
    res.send("ocurrio un error : " + err.message);
})

export default app;