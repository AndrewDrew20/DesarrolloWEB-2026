const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    id_category:{type:String,required:true},
    id_User:{type:String,required:false},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    stock:{type:Number,required:true,default:0},
    rating:{type:Number,required:false},
    imageUrl:{type:String,required:false}
});

module.exports=mongoose.model('Product',productSchema);