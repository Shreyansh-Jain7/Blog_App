const mongoose=require("mongoose");
const blogSchema=mongoose.Schema({
    username : String,
    title:String,
    content:String,
    category:String,
    date:Date,
    likes:Number,
    comments:[{username:String,content:String}]
},{
    versionKey:false
})

const Blog=mongoose.model("blog",blogSchema);

module.exports={Blog};