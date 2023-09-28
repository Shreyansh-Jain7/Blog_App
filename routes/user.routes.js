const express=require("express");
const {User}=require("../models/user.model");
const userRouter=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

userRouter.post("/register",async(req,res)=>{
    const {username,avatar,email,password}=req.body;
    try {
        const user= await User.find({username,email});
        if(user.length==0){
            bcrypt.hash(password,5,async(err,hash)=>{
                const new_user=new User({username,avatar,email,password:hash});
                await new_user.save();
                res.status(201).send({"msg":"new user has been added"});
            })
        }else{
            res.status(400).send({"msg":"User already exists, please login"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.find({email});
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                result? res.status(200).send({"msg":"login successful","token":jwt.sign({"username":user[0].username},"secretkey",{expiresIn:"1h"})}):
                    res.status(400).send({"msg":"Wrong credentials"});
            })
        }else{
            res.status(400).send({"msg":"Wrong credentials"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

module.exports={userRouter};