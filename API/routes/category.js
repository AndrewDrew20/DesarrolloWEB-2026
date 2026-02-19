const express=require('express');
const router=express.Router();

const Category=require('../models/categoryModel');



//middleware to get products by ID
const getCategory=async(req,res,next)=>{
    let category;
    try{
         category=await Category.findById(req.params.id);
        if(category==null){
            return res.status(404).json({message:'Cannot find category'});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }
res.category=category;
next();
}

//get all categories
router.get('/', async (req,res)=>{
    try{
        const category= await Category.find();
        res.json(category);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})


//get one category
router.get('/:id',getCategory,(req,res)=>{
    res.send(res.category);
})

//create category
router.post('/', async (req,res)=>{
    const category=new Category({
        name:req.body.name,
        description:req.body.description
    });
    try{
        const existingCategory=await Category.findOne({name:req.body.name});
        if(existingCategory){
            return res.status(400).json({message:'Category name already exists'});
        }else{
        const newCategory= await category.save();
        res.status(201).json(newCategory);
    }
    
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

//update category
router.patch('/:id',getCategory,async(req,res)=>{
    if(req.body.name!=null){
        res.category.name=req.body.name;
    }
    if(req.body.description!=null){
        res.category.description=req.body.description;
    }
    try{
        const updatedCategory= await res.category.save();
        res.json(updatedCategory);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

//delete user 
router.delete('/:id',getCategory,async(req,res)=>{
    try{
        await res.category.deleteOne();
        res.json({message:"Category Deleted"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

module.exports=router;