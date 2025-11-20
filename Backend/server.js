import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app=express();

const PORT=5000;

app.get("/",(req,res)=>{
    res.json("Api working fine");
});
app.listen(PORT,()=>{
  console.log("server is running on port",PORT)
})
