// routes/surveyRoutes.ts
import express, { Request, Response } from 'express';
import { createSurvey, getAllSurveys, getSurveyById  } from '../controllers/surveyController';

const router = express.Router();

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

router.get("/surveys/:id", getSurveyById);

export default router;
