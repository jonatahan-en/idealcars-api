import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const {JWT_SECRET} = process.env
export function guard(req, res, next) {
    const tokenJWT = req.get("Authorization") ||req.body.jwt || req.query.jwt
    if (!tokenJWT) {
        next(createError(401, "No se ha proporcionado un token JWT"))
        return
    }
    jwt.verify(tokenJWT, JWT_SECRET, (err, payload) => {
        if (err) {
            next(createError(401, "Token JWT no válido"))
            return
        }
        req.apiUserId = payload._id
        next()
    })
}