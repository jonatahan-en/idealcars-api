
# IdealCars API

IdealCars API es un proyecto diseñado para gestionar información relacionada con vehículos. Este proyecto utiliza Node.js y varias herramientas para facilitar el desarrollo y la gestión de datos.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 20.17.0)
- [npm](https://www.npmjs.com/) (incluido con Node.js)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/jonatahan-en/idealcars-api.git

   ```

2. Navega al directorio:

    ```bash
    cd idealcars-api/idealCars

    ```

3. Instalar las dependencias:

    ```bash
    npm install
    ```

## Uso

1. iniciar el servidor en desarrollo:

    ```bash
    npm run dev
    ```

2. iniciar el servidor en produccion

    ```bash
        npm start
    ```

3. iniciar mongoDB

    ```bash
        npm run initDB
    ```

## API

Base URI: http://localhost:3000/api

### Product list

GET /products

```json
{
    "results":[
        {
        "_id": "68028bea9c96b56f918a8647",
        "name": "Ford",
        "model": "Focus",
        "color": "gris",
        "year": 2020,
        "price": 18000,
        "kilometer": 20000,
        "image": "ford.jpg",
        "owner": "68028bea9c96b56f918a863f",
        "__v": 0
        }
    ],
  "count": 4
}

```

## Dependencias

```bash
basic-auth: Manejo de autenticación básica.
bcrypt: Encriptación de contraseñas.
connect-mongo: Almacenamiento de sesiones en MongoDB.
cookie-parser: Análisis de cookies.
dotenv: Manejo de variables de entorno.
express: Framework para construir aplicaciones web.
express-session: Manejo de sesiones.
jsonwebtoken: Generación y verificación de tokens JWT.
mongoose: Modelado de datos para MongoDB.
swagger-jsdoc: Generación de documentación Swagger.
swagger-ui-express: Interfaz para documentación Swagger.
Dependencias de desarrollo
nodemon: Reinicio automático del servidor durante el desarrollo.

```
