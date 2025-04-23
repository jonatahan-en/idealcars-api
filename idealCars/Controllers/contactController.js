import nodemailer from 'nodemailer'
//import User from './../models/User.js'
//import connectMongoose from '../lib/connectMongoose'

export function Contact (req, res , next){
   /* const userId = req.session.userId
    nodemailer.createTransport({
        host: userId,
        port: 587,
        secure:false,
        auth:{
            user:"username",
            pass: "password"
        }
    })


*/
    res.render('email')
}