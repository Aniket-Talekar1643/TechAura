import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoutes from './routes/user.routes.js'
import ProjectRoutes from './routes/project.routes.js';
import TaskRoutes from './routes/Task.Routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/users", UserRoutes);
app.use("/api/projects", ProjectRoutes);
app.use("/api", TaskRoutes)

app.get("/", (req, res) => {
  res.json("Api working fine");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT)
})
