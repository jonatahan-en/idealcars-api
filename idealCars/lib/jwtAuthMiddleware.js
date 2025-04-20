import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export function guard(req,res, next){
    //sacar el tokenJWT de cabecera, body , o de la query-string
    const authString = req.get('Authorization') || req.body.jwt || req.query.jwt

    console.log('tokenJWT', authString)
    //si  no tengo token --> error
    if(!authString){
        next(createError(401, 'no token provided'))
        return
    }
    //quitamos la plabra bearer
    const tokenJWT = authString.split(' ')[1];
    //compruebo que el token es válido
    jwt.verify(tokenJWT, process.env.JWT_SECRET,(err,payload)=>{
        if(err){
            next(createError(401, 'invalid token'))
            return
        }

        // apuntmamos el id del usuario logado en la request
        // para que los próximos middlewares puedan leerlo
        req.apiUserId = payload._id
        next()
    })
}