import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';  
import user16PFTestRoutes from './routes/user16PFTestRoutes';

dotenv.config();

const app: Application = express();

connectDB();

app.use(cors());
app.use(express.json());

//Use routes
app.use('/api/user16pfTest', user16PFTestRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
