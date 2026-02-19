const express=require('express');
const router=express.Router();
const User=require('../models/userModel');


//middleware para encontrar las cosas por el ID
const getUsuarios=async(req,res,next)=>{
    let users;
    try{
         users=await User.findById(req.params.id);
        if(users==null){
            return res.status(404).json({message:'Cannot find user'});
        }
    }catch(err){
        return res.status(500).json({message:"cannot find user"});
    }
res.users=users;
next();
}


//get all users
router.get('/', async (req,res)=>{
    try{
        const users= await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})
//get one user
router.get('/:id',getUsuarios,(req,res)=>{
    res.send(res.users);

})


//create user
router.post('/', async (req,res)=>{
    const user=new User({
        auth0Id:req.body.auth0Id,
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    });
    try{
        const newUser= await user.save();
        res.status(201).json(newUser);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})


//update user
router.patch('/:id',getUsuarios,async(req,res)=>{
    if(req.body.name!=null){
        res.users.name=req.body.name;
    }
    if(req.body.lastName!=null){
        res.users.lastName=req.body.lastName;
    }
    if(req.body.email!=null){
        res.users.email=req.body.email;
    }
    if(req.body.age!=null){
        res.users.age=req.body.age;
    }
    if(req.body.Password!=null){
        res.users.Password=req.body.Password;
    }
    if(req.body.role!=null){
        res.users.role=req.body.role;
    }
    try{
        const updatedUser= await res.users.save();
        res.json(updatedUser);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})


//delete user 
router.delete('/:id',getUsuarios,async(req,res)=>{
    try{
        await res.users.deleteOne();
        res.json({message:"User Deleted"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})




module.exports=router;