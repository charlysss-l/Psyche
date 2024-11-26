// routes/surveyResponseRoutes.ts
import express from 'express';
import { getAllSurveysForStudents, submitSurveyResponses, getStudentResponses, getAllStudentsSurveyResponses, } from '../controllers/surveyResponseController';

const router = express.Router();

// Route to get all surveys for students
router.get('/surveys', getAllSurveysForStudents);

// Route to submit survey responses
router.post('/surveys/submit', submitSurveyResponses);



// Route to get responses for a specific student
router.get('/responses/student/:studentId', getStudentResponses);

// Endpoint to fetch all survey responses
router.get('/survey-responses', getAllStudentsSurveyResponses);


export default router;
