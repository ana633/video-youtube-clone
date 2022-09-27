import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';

import path from "path"
const __dirname = path.resolve();

const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO)
    .then( () => {
        console.log("Connected to DB");
    })
    .catch(error => console.log(error));
};


app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message,
    });
});

app.use(express.static(path.join(__dirname,'public')));
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html' ))
})
app.listen(process.env.PORT || 3000, () => {
    connect();
    console.log("Connected to Server");
})