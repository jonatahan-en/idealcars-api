import mongoose,{Schema} from "mongoose";

const productSchema = new Schema({
    name:  { type:String, required: true, index: true },
    model:  { type:String, required: true, index: true }, 
    color:  { type:String, required: true , index: true }, 
    year:  {type:Number, min: 1980, max:2024, index: true },
    price: { type:Number, min:0 , max:100000, index: true },
    kilometer: { type: Number, min : 0 , max: 500000, index: true }, 
    image: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', index: true },
})

productSchema.statics.list =function(filter, limit, skip, sort, fields){
    const query = Product.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    return query.exec()
}

const Product = mongoose.model('Product', productSchema);
export default Product;