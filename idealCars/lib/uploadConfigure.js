import multer from 'multer';
import path from 'path';
import { __dirname } from './utils.js';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const ruta = path.join( __dirname, '..', 'public', 'imagenes')
        callback(null, ruta)
    },
    filename: function (req, file, callback) {
        const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`
        callback(null, filename)
    }
})

const upload = multer({ storage }) 
export default upload
