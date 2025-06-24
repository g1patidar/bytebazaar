import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import categoryRoutes from './routes/category.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        console.log("origin:",origin)
        const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:8080'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use('/api/auth', authRoutes); // 🧠 Here
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);

mongoose.connect(process.env.MONGO_URI as string).then(() => {
    console.log('✅ MongoDB connected');
    app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error(`❌ MongoDB connection error:`, err)
});
