const express=require('express');
const router=express.Router();

const Product=require('../models/productModel');

//middleware to get products by ID
const getProduct=async(req,res,next)=>{
    let products;
    try{
         products=await Product.findById(req.params.id);
        if(products==null){
            return res.status(404).json({message:'Cannot find product'});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }
res.products=products;
next();
}

//get all products
router.get('/', async (req,res)=>{
    try{
        const products= await Product.find();
        res.json(products);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

//get one product
router.get('/:id',getProduct,(req,res)=>{
    res.send(res.products);

})

//create product
router.post('/', async (req,res)=>{
    const product=new Product({
        name:req.body.name,
        id_category:req.body.id_category,
        id_User:req.body.id_User,
        description:req.body.description,
        price:req.body.price,
        stock:req.body.stock,
        rating:req.body.rating,
        imageUrl:req.body.imageUrl
    });
    try{
        const newProduct= await product.save();
        res.status(201).json(newProduct);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

//update product
router.patch('/:id',getProduct,async(req,res)=>{
    if(req.body.name!=null){
        res.products.name=req.body.name;
    }
    if(req.body.id_category!=null){
        res.products.id_category=req.body.id_category;
    }
    if(req.body.id_User!=null){
        res.products.id_User=req.body.id_User;
    }
    if(req.body.description!=null){
        res.products.description=req.body.description;
    }
    if(req.body.price!=null){
        res.products.price=req.body.price;
    }
    if(req.body.stock!=null){
        res.products.stock=req.body.stock;
    }
    if(req.body.rating!=null){
        res.products.rating=req.body.rating;
    }
    if(req.body.imageUrl!=null){
        res.products.imageUrl=req.body.imageUrl;
    }
    try{
        const updatedProduct= await res.products.save();
        res.json(updatedProduct);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

//delete product
router.delete('/:id',getProduct,async(req,res)=>{
    try{
        await res.products.deleteOne();
        res.json({message:"Product Deleted"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

module.exports=router;