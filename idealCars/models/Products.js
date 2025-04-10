import mongoose,{Schema} from "mongoose";

const productSchema = new Schema({
    name: { type: String, unique:false  },
    model: { type: String, required: true },
    color: { type: String },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    kilometer: { type: Number },
    image: { type: String },
})

const Product = mongoose.model('Product', productSchema);
export default Product;