// controllers/surveyController.ts
import { Request, Response } from 'express';
import SurveyModel from '../models/surveySchema';

// Create a new survey
export const createSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, questions } = req.body; // Destructure description from request body
    const newSurvey = new SurveyModel({ title, description, questions }); // Include description when creating the survey
    await newSurvey.save();
    res.status(201).json(newSurvey); // Return the newly created survey
  } catch (error) {
    res.status(500).json({ message: 'Error creating survey', error });
  }
};

// Get all surveys
export const getAllSurveys = async (req: Request, res: Response): Promise<void> => {
  try {
    const surveys = await SurveyModel.find(); // Fetch all surveys
    res.status(200).json(surveys); // Return the surveys in the response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error });
  }
};
