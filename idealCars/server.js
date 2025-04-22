import "dotenv/config";
import http from 'http';
import debugLib from 'debug';
import app from './app.js';

const debug = debugLib("idealcars:server");
const port = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');



// create a server 
const server = http.createServer(app);

server.on("error", err => console.error(err));
server.on("listening", () => {debug(`Servidor arrancado en el puerto ${port}`)});
server.listen(port) 

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la base de datos
require('./config/db');

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Ruta principal
app.get('/', (req, res) => {
  res.send('API de recuperación de contraseña funcionando');
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));