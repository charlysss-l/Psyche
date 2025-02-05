import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import user16PFTestRoutes from './routes/user16PFTestRoutes';
import userIQTestRoutes from './routes/UserIQTestRoutes';
import userCFTestRoutes from './routes/UserCFTestRoutes';
import Test16PFRoutes from './routes/Test16PFRoutes';
import IQTestRoutes from './routes/IQTestRoutes';
import CFTestRoutes from './routes/CFTestRoutes';
import uploadRoutes from './controllers/uploadController';
import consultationsRoutes from './routes/consultationroutes';
import followUpRoutes from './routes/followUpRoutes';
import authPsychRoutes from './authRoutes/authPsychRoutes';
import authGuidanceRoutes from './authRoutes/authGuidanceRoutes';
import authStudentsRoutes from './authRoutes/authStudentsRoutes';
import userRoutes from './authRoutes/userRoutes';
import surveyRoutes from './routes/surveyRoutes';
import surveyResponseRoutes from './routes/surveyResponseRoutes';
import { updateInterpretationBySpecificId } from './controllers/IQTestController';
import omrIQRoutes from './routes/omrIQRoutes';
import omrCFRoutes from './routes/omrCFRoutes';
import omrPFRoutes from './routes/omrPFRoutes';
import textDisplayRoutes from './routes/textDisplayRoutes';
import OnlineConsultRoutes from './routes/OnlineConsultRoutes';
import axios from 'axios';



dotenv.config();

const app: Application = express();

// Connect to the database
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
})

// Middleware configuration
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Use routes
app.use('/api/user16pf', user16PFTestRoutes);
app.use('/api/useriq', userIQTestRoutes);
app.use('/api/usercf', userCFTestRoutes);
app.use('/api/16pf', Test16PFRoutes);
app.use('/api/IQtest', IQTestRoutes);
app.use('/api/CFtest', CFTestRoutes);
app.use('/api', uploadRoutes);
app.use('/api/consult', consultationsRoutes);
app.use('/api/followup', followUpRoutes);
app.put('/api/IQtest/:id/interpretation/:interpretationId', updateInterpretationBySpecificId);

app.use('/api/omr', omrIQRoutes); // iq
app.use('/api/omr16pf', omrPFRoutes); //pf
app.use('/api/omrcf', omrCFRoutes); //cf

app.use('/api/textDisplay', textDisplayRoutes);

// Survey routes
app.use('/api', surveyRoutes);

app.use('/api/response', surveyResponseRoutes); 
app.use('/api', surveyResponseRoutes); 


// Authentication routes

app.use('/api/auth', authPsychRoutes);
app.use('/api/authGuidance', authGuidanceRoutes);
app.use('/api/authStudents', authStudentsRoutes);

app.use('/api/allusers', userRoutes);

app.use('/api/onlineconsult', OnlineConsultRoutes);


// Example of calling the Python service
app.post('/process_omr_PF', async (req, res) => {
  try {
    const image_url = req.body.image_url;
    
    // Updated URL to the Python service on PythonAnywhere
    const response = await axios.post('https://pftest.pythonanywhere.com/process_omr_PF', { image_url });
    
    // Send back the data from Python service to the client
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Python API', details: error });
  }
});



// Example of calling the Python service
app.post('/process_omr_IQ', async (req, res) => {
  try {
    const image_url = req.body.image_url;
    const response = await axios.post('https://iqtestOmr.pythonanywhere.com/process_omr_IQ', { image_url });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Python API', details: error });
  }
});

// Example of calling the Python service
app.post('/process_omr_CF', async (req, res) => {
  try {
    const image_url = req.body.image_url;
    const response = await axios.post('https://cftestOmr.pythonanywhere.com/process_omr_CF', { image_url });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Python API', details: error });
  }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
