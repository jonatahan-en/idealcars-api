import mongoose,{Schema} from "mongoose";

const productSchema = new Schema({
    name:  { type:String, unique: false },
    model:  { type:String} ,
    color:  { type:String} ,
    year:  {type:Number, min: 1990, max:2023},
    price: { type:Number, min:0 , max:50000},
    kilometer: { type: Number, min : 0 , max: 500000}, 
    image: { type: String }
})

const Product = mongoose.model('Product', productSchema);
export default Product;