import session from 'express-session'
import MongoStore from'connect-mongo'


const {MONGODB_URI, SESSION_SECRET} = process.env
const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2 
//middleware para gestionar sesiones
export const middleware = session({
    name:'idealCars-session',
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: INACTIVITY_EXPIRATION_2_DAYS,
        secure: process.env.NODECARS_ENV === 'production',
        httpOnly:true,
        sameSite:'lax'

    },
    //las sesiones se guardan en MongoDB
    store: MongoStore.create({
        mongoUrl: MONGODB_URI
    })
})

export function useSessionInViews(req, res, next){
    res.locals.session = req.session
    next()
}

export function isLoggedIn(req, res, next){
    if(!req.session.userId){
         // Si la ruta es /products/new, muestra mensaje especial
        if (req.path === '/products/new' || req.originalUrl === '/products/new') {
            return res.render('login', {
                redirectMessage: res.__('login.redirectNewAd')
            });
        }
        // Para otras rutas privadas, redirige normalmente
        return res.redirect('/login');
    }
    next();
}
