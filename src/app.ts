/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import routes

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173" /* Client live link:https://product-hub-online.vercel.app
    Server Live: https://product-hub-server-psi.vercel.app */,
    credentials: true,
  })
);

// Routes

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Meeting Room Project API!");
});

mongoose
  .connect(process.env.DATABASE_URL as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

export default app;
