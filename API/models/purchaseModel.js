const mongoose = require('mongoose');

const purchaseModel=new mongoose.Schema({
    id_Product:{type:String,required:true},
    id_Category:{type:String,required:true},
    id_User:{type:String,required:true},
    totalPrice:{type:Number,required:true},
    status:{type:String,required:true},
    shippingAddress:{type:String,required:true},
    description:{type:String,required:true}

});

module.exports = mongoose.model('Purchase', purchaseModel);