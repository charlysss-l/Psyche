import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import user16PFTestRoutes from './routes/user16PFTestRoutes';
import userIQTestRoutes from './routes/UserIQTestRoutes';
import Test16PFRoutes from './routes/Test16PFRoutes';

dotenv.config();

const app: Application = express();

connectDB();

app.use(cors());
app.use(express.json());

//Use routes
app.use('/api/user16pf', user16PFTestRoutes);   // 16PF test routes
app.use('/api/useriq', userIQTestRoutes);
app.use('/api/16pf', Test16PFRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
