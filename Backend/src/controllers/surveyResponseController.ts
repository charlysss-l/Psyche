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
    const { surveyId, responses, userId } = req.body;  // Extract surveyId, responses, and userId from the request body

    // Map the responses to ensure they are aligned with sections
    const formattedResponses = responses.map((response: any) => {
      return {
        sectionTitle: response.sectionTitle,  // Ensure sectionTitle is present
        questionId: response.questionId,  // Reference to the question
        choice: response.choice,  // The choice selected by the user
      };
    });

    // Create a new SurveyResponse entry
    const newResponse = new SurveyResponse({
      surveyId,
      userId,
      responses: formattedResponses,  // Save the responses including sections
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
      .populate('surveyId', 'title')  // Populate survey title
      .populate('responses.questionId', 'questionText')  // Populate question text
      .exec();

    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching survey responses' });
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
  try {
    const { surveyId } = req.query;
    const filter = surveyId ? { surveyId } : {};  // Optionally, filter by surveyId

    // Populate surveyId to get the sections and questions from the Survey model
    const responses = await SurveyResponse.find(filter)
      .populate('surveyId', 'title sections')  // Populate surveyId and include the sections
      .exec();

    res.status(200).json(responses);  // Return the responses with sections populated
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({ message: 'Error fetching survey responses' });
  }
};
