// controllers/surveyController.ts
import { Request, Response } from 'express';
import SurveyModel from '../models/surveySchema';

// Create a new survey
export const createSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, sections } = req.body;
    const newSurvey = new SurveyModel({ title, description, sections });
    await newSurvey.save();
    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(500).json({ message: 'Error creating survey', error });
  }
};

// Get all surveys
export const getAllSurveys = async (req: Request, res: Response): Promise<void> => {
  try {
    const surveys = await SurveyModel.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error });
  }
};
