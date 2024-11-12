// routes/surveyRoutes.ts
import express, { Request, Response } from 'express';
import { createSurvey, getAllSurveys } from '../controllers/surveyController';

const router = express.Router();

// Correct async route handler with proper types
router.post('/surveys/create', async (req: Request, res: Response) => {
  try {
    await createSurvey(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error creating survey', error });
  }
});

router.get('/surveys', async (req: Request, res: Response) => {
  try {
    await getAllSurveys(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error });
  }
});



export default router;
