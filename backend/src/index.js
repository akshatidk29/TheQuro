import cors from "cors";
import dotenv from "dotenv";
import express from "express"
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";

import authRoutes from "./Routes/authRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import documentRoutes from "./Routes/documentRoutes.js";
import profileRoutes from "./Routes/profileRoutes.js";

dotenv.config();

const app = express() 
const PORT = process.env.PORT;


app.use(express.json()); 
app.use(cookieParser());
app.use(
  cors({ 
    origin: ["http://localhost:5173",`${process.env.IPV4_URL}:5173`],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);                 // Ok
app.use("/uploads", express.static("uploads"));
app.use("/api/notes", uploadRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);


app.listen(PORT, () => {
    console.log("Server Running -", PORT);
    connectDB();
})