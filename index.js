const express=require("express");
const app=express();
require("dotenv").config();
const {connection}=require("./db");
const {userRouter}=require("./routes/user.routes");
const {blogRouter}=require("./routes/blog.routes");
const cors=require("cors");
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to Blog App");
})
app.use("/api",userRouter);

app.use("/api/blogs",blogRouter);


app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log(`Connected to mongoDB Atlas`);
        console.log(`Running the server at port ${process.env.port}`);
    } catch (err) {
        console.log(err);
    }
})