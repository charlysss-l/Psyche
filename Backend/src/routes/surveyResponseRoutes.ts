// routes/surveyResponseRoutes.ts
import express from 'express';
import { getAllSurveysForStudents, submitSurveyResponses, getStudentResponses, getAllStudentsSurveyResponses, getArchivedSurveysByUserId } from '../controllers/surveyResponseController';

const router = express.Router();

// Route to get all surveys for students
router.get('/surveys', getAllSurveysForStudents);

// Route to submit survey responses
router.post('/surveys/submit', submitSurveyResponses);

// Route to get responses for a specific student
router.get('/responses/student/:userId', getStudentResponses);

// Endpoint to fetch all survey responses
router.get('/survey-responses', getAllStudentsSurveyResponses);

// Endpoint to fetch archived survey responses
router.get('/archived-surveys/:userId', getArchivedSurveysByUserId);

export default router;
