import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId :{type:String , required:true ,ref:"user"},// 👉ref:"user" product kis user ne upload kiya uska reference store karta hai (user model se linked)
    name:{type:String , required : true},
    description :{type:String , required :true},
    price :{type:Number , required :true},
    offerPrice :{type:Number , required :true},
    image :{type:Array , required :true},
    category :{type:String , required :true},
    date:{type:Number, required:true}
})
const Product = mongoose.models.product || mongoose.model('product',productSchema);
export default Product;