import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import user16PFTestRoutes from './routes/user16PFTestRoutes';
import userIQTestRoutes from './routes/UserIQTestRoutes';
import Test16PFRoutes from './routes/Test16PFRoutes';
import IQTestRoutes from './routes/IQTestRoutes';
import uploadRoutes from './controllers/uploadController';
import consultationsRoutes from './routes/consultationroutes';
import authPsychRoutes from './authRoutes/authPsychRoutes';
import authGuidanceRoutes from './authRoutes/authGuidanceRoutes';
import authStudentsRoutes from './authRoutes/authStudentsRoutes';


dotenv.config();

const app: Application = express();

// Connect to the database
connectDB();

// Middleware configuration
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Use routes
app.use('/api/user16pf', user16PFTestRoutes);
app.use('/api/useriq', userIQTestRoutes);
app.use('/api/16pf', Test16PFRoutes);
app.use('/api/IQtest', IQTestRoutes);
app.use('/api', uploadRoutes);
app.use('/api/consult', consultationsRoutes);

// Authentication routes
app.use('/api/auth', authPsychRoutes);
app.use('/api/authGuidance', authGuidanceRoutes);
app.use('/api/authStudents', authStudentsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
