import multer from 'multer';
import path from 'path';
import { __dirname } from './utils.js';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const ruta = path.join(__dirname, '..', 'public', 'imagenes');
        callback(null, ruta);
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        callback(null, `${basename}-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({ storage }); 
export default upload
