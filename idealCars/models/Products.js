import mongoose,{Schema} from "mongoose";

const productSchema = new Schema({
    name:  { type:String },
    model:  { type:String, required: true }, 
    color:  { type:String, required: true }, 
    year:  {type:Number, min: 1980, max:2024},
    price: { type:Number, min:0 , max:100000},
    kilometer: { type: Number, min : 0 , max: 500000}, 
    image: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Product = mongoose.model('Product', productSchema);
export default Product;