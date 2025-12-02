import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from './routes/user.routes.js'
import BlogsRoutes from './routes/blog.routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/users", UserRoutes);
app.use("/api/blogs", BlogsRoutes);

app.get("/", (req, res) => {
  res.json("Api working fine");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT)
})
