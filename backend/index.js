import express from 'express';
import dotenv from 'dotenv';
import { connectCloudinary } from './config/cloudinary.js';

dotenv.config({ path: './.env' });
connectCloudinary();

import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import geminiResponse from './gemini.js';

const app = express();
app.use(cors({
  origin: 'https://virtualassistance-gddq.onrender.com',
  credentials: true,
}))
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});


