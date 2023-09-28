const express=require("express");
const blogRouter=express.Router();
const {Blog}=require("../models/blog.model");
const {User}=require("../models/user.model");
const jwt=require("jsonwebtoken");

blogRouter.get("/",async(req,res)=>{
    let {title,category,sort,order}=req.query;
    let filter={title,category};
    if(!title && !category){
        filter={};
    }else if(!title){
        filter={category}
    }else if(!category){
        filter={title}
    }
    if(!sort){
        order="desc"
    }
    try {
        const blogs=await Blog.find(filter).sort({date:order});
        res.status(200).send(blogs);
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

// blogRouter.get("/:id",async(req,res)=>{
//     try {
//         const books=await Book.find({_id:req.params.id});
//         res.status(200).send(books);
//     } catch (error) {
//         res.status(400).send({"msg":error.message});
//     }
// })

blogRouter.post("/",async(req,res)=>{
    const decoded=jwt.verify(req.headers.authorization,"secretkey");
    const username=decoded.username;
    const {title,content,category}=req.body;
    try {
        const user=await User.find({username});
        if(user.length>0){
            const date=new Date();
            const blog=new Blog({username,title,content,category,date,likes:0,comments:[]});
            await blog.save();
            res.status(201).send({"msg":"blog has been added"});
        }else{
            res.status(400).send({"msg":"You have to login to post a blog"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.patch("/:id",async(req,res)=>{
    const decoded=jwt.verify(req.headers.authorization,"secretkey");
    const username=decoded.username;

    try {
        const user=await User.find({username});
        if(user.length>0){
            await Blog.findByIdAndUpdate({_id:req.params.id},{...req.body,date:new Date()});
            res.status(200).send({"msg":"blog has been updated"});
        }else{
            res.status(400).send({"msg":"You have to be logged in to edit a blog"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.delete("/:id",async(req,res)=>{
    const decoded=jwt.verify(req.headers.authorization,"secretkey");
    const username=decoded.username;

    try {
        const user=await User.find({username});
        if(user.length>0){
            await Blog.findByIdAndDelete({_id:req.params.id});
            res.status(204).send({"msg":"blog has been deleted"});
        }else{
            res.status(400).send({"msg":"You have to be logged in to delete a blog"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.patch("/:id/like",async(req,res)=>{
    const decoded=jwt.verify(req.headers.authorization,"secretkey");
    const username=decoded.username;

    try {
        const user=await User.find({username});
        if(user.length>0){
            const blog= await Blog.find({_id:req.params.id});
            let likes=++blog[0].likes;
            await Blog.findByIdAndUpdate({_id:req.params.id},{likes});
            res.status(200).send({"msg":"blog has been liked"});
        }else{
            res.status(400).send({"msg":"You have to be logged in to like a blog"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})

blogRouter.patch("/:id/comment",async(req,res)=>{
    const decoded=jwt.verify(req.headers.authorization,"secretkey");
    const username=decoded.username;

    try {
        const user=await User.find({username});
        if(user.length>0){
            const blog= await Blog.find({_id:req.params.id});
            let content= req.body.content;
            let comments=blog[0].comments;
            comments.push({"username":username,"content":content})
            console.log(username);
            await Blog.findByIdAndUpdate({_id:req.params.id},{comments});
            res.status(200).send({"msg":"your comment is saved"});
        }else{
            res.status(400).send({"msg":"You have to be logged in to comment on a blog"});
        }
    } catch (error) {
        res.status(400).send({"msg":error.message});
    }
})


module.exports={blogRouter}