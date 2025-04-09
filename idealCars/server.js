import http from 'http';
import debugLib from 'debug';
import app from './app.js';


const debug = debugLib("idealcars:server");
const port = process.env.PORT || 5000



// create a server 
const server = http.createServer(app);

server.on("error", err => console.error(err));
server.on("listening", () => {debug(`Servidor arrancado en el puerto ${port}`)});
server.listen(port) 