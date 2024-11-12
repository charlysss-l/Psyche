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

// Controller to submit survey responses
export const submitSurveyResponses = async (req: Request, res: Response) => {
    try {
      const { studentId, surveyId, responses } = req.body;
  
      // Convert studentId to ObjectId
      const studentObjectId = new Object(studentId);  // Ensure studentId is an ObjectId
  
      const newResponse = new SurveyResponse({
        studentId: studentObjectId,  // Save the ObjectId in the database
        surveyId,
        responses,
      });
  
      await newResponse.save();
      res.status(201).json({ message: 'Survey responses submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error submitting responses' });
    }
  };

  // Admin: Get all survey responses (for a specific survey or all surveys)
export const getAllSurveyResponses = async (req: Request, res: Response) => {
    try {
      const { surveyId } = req.query;  // Optionally, filter by surveyId
      const filter = surveyId ? { surveyId } : {};  // If surveyId is provided, filter responses by surveyId
  
      const responses = await SurveyResponse.find(filter)
        .populate('studentId', 'email userId')  // Populate student information (email, userId)
        .populate('surveyId', 'title')  // Populate survey title
        .populate('responses.questionId', 'questionText')  // Populate question text
        .exec();
  
      res.status(200).json(responses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching survey responses' });
    }
  };

  // controllers/surveyResponseController.ts
export const getStudentResponses = async (req: Request, res: Response) => {
    const { studentId } = req.params;  // Get the studentId from the URL params
  
    try {
      const responses = await SurveyResponse.find({ studentId });  // Find all responses for the given studentId
      res.status(200).json(responses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching responses' });
    }
  };
  
// controllers/surveyResponseController.ts
export const getAllStudentsSurveyResponses = async (req: Request, res: Response) => {
    try {
      const { surveyId } = req.query;
      const filter = surveyId ? { surveyId } : {};  // Optionally, filter by surveyId
  
      // Populate the surveyId to get the questions from the Survey model
      const responses = await SurveyResponse.find(filter)
        .populate('studentId', 'email userId')  // Populate student information (email, userId)
        .populate('surveyId', 'title questions')  // Populate surveyId and include the questions
        
        .exec();
  
      // Now, questions will be available inside the surveyId field in the response
      res.status(200).json(responses);
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      res.status(500).json({ message: 'Error fetching survey responses' });
    }
  };
  
  