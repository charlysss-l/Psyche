import { Request, Response } from 'express';
import Survey from '../models/surveySchema';
import SurveyResponse from '../models/surveyResponseSchema';
import mongoose from 'mongoose';

// Controller to fetch all surveys for students
export const getAllSurveysForStudents = async (req: Request, res: Response) => {
  try {
    const surveys = await Survey.find(); // Fetch all surveys
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys' });
  }
};

export const submitSurveyResponses = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { surveyId, responses, userId } = req.body;

    // Validate that each response has a valid questionId and choice
    const formattedResponses = responses.map((response: any) => {
      if (!response.questionId || !response.choice) {
        throw new Error('Invalid response data');
      }
      return {
        questionId: response.questionId,
        choice: response.choice,

      };
    });

    // Create a new SurveyResponse entry
    const newResponse = new SurveyResponse({
      surveyId,
      userId,  // Store the userId along with responses
      responses: formattedResponses,  
    });

    await newResponse.save();
    res.status(201).json({ message: 'Survey responses submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting responses' });
  }
};

// Get responses for a specific student (userId)
export const getStudentResponses = async (req: Request, res: Response) => {
  const { userId } = req.params;  // Changed studentId to userId

  try {
    const responses = await SurveyResponse.find({ userId });  // Changed studentId to userId
    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
};


export const getAllStudentsSurveyResponses = async (req: Request, res: Response) => {
  const { surveyId } = req.query;
  if (!surveyId) {
     res.status(400).json({ error: 'Survey ID is required' });
     return;
  }

  try {
    const responses = await SurveyResponse.find({ surveyId });
    if (responses.length === 0) {
       res.status(404).json({ error: 'No responses found for this survey' });
       return;
    }
    res.json(responses);
  } catch (err) {
    console.error('Error fetching survey responses:', err);
    res.status(500).json({ error: 'Failed to fetch survey responses' });
  }
};
