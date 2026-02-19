const express=require('express');
const router=express.Router();

const Purchase=require('../models/purchaseModel');

//middleware to get purchase by ID
const getPurchase=async(req,res,next)=>{
    let purchase;
    try{
         purchase=await Purchase.findById(req.params.id);
        if(purchase==null){
            return res.status(404).json({message:'Cannot find purchase'});
        }
    }catch(err){
        return res.status(500).json({message:"cannot find purchase"});
    }
res.purchase=purchase;
next();
}

//get all purchases
router.get('/', async (req,res)=>{
    try{
        const purchases= await Purchase.find();
        res.json(purchases);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

//get one purchase
router.get('/:id',getPurchase,(req,res)=>{
    res.send(res.purchase);

})

//create purchase
router.post('/', async (req,res)=>{
    const purchase=new Purchase({
        id_Product:req.body.id_Product,
        id_Category:req.body.id_Category,
        id_User:req.body.id_User,
        totalPrice:req.body.totalPrice,
        status:req.body.status,
        shippingAddress:req.body.shippingAddress,
        description:req.body.description
    });
    try{
        const newPurchase= await purchase.save();
        res.status(201).json(newPurchase);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

//update purchase
router.patch('/:id',getPurchase,async(req,res)=>{
    if(req.body.id_Product!=null){
        res.purchase.id_Product=req.body.id_Product;
    }
    if(req.body.id_Category!=null){
        res.purchase.id_Category=req.body.id_Category;
    }
    if(req.body.id_User!=null){
        res.purchase.id_User=req.body.id_User;
    }
    if(req.body.totalPrice!=null){
        res.purchase.totalPrice=req.body.totalPrice;
    }
    if(req.body.status!=null){
        res.purchase.status=req.body.status;
    }
    if(req.body.shippingAddress!=null){
        res.purchase.shippingAddress=req.body.shippingAddress;
    }
    if(req.body.description!=null){
        res.purchase.description=req.body.description;
    }
    try{
        const updatedPurchase= await res.purchase.save();
        res.json(updatedPurchase);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})
 
//delete purchase Just in case
router.delete('/:id',getPurchase,async(req,res)=>{
    try{
        await res.purchase.deleteOne();
        res.json({message:"Purchase Deleted"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})
module.exports=router;
