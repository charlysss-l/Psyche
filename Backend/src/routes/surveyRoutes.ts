// routes/surveyRoutes.ts
import express, { Request, Response } from 'express';
import { createSurvey, getAllSurveys, getSurveyById ,deleteSurvey, completeSurvey } from '../controllers/surveyController';

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

router.delete('/surveys/:id', deleteSurvey);
router.get("/surveys/:id", getSurveyById);
router.put("/surveys/complete/:id", completeSurvey);

export default router;
