import { Request, Response } from 'express';
import SurveyModel from '../models/surveySchema';

// Create a new survey
export const createSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, filters, sections, releaseDate } = req.body;

    // Validate that the required fields are present
    if (!title || !description || !category || !sections || !releaseDate) {
      res.status(400).json({ message: 'Title, description, category, sections, and releaseDate are required' });
      return;
    }

    // Validate filters format
    if (filters && !Array.isArray(filters)) {
      res.status(400).json({ message: 'Filters must be an array of filter objects' });
      return;
    }

    // Ensure that each filter has a 'field' and 'options' (options should be a string)
    if (filters) {
      for (const filter of filters) {
        if (!filter.field || !filter.options) {
          res.status(400).json({ message: 'Each filter must have a "field" and "options"' });
          return;
        }
        if (typeof filter.options !== 'string') {
          res.status(400).json({ message: 'Options must be a string, with comma-separated values' });
          return;
        }
      }
    }

    // Generate a unique surveyId (you could use a UUID or generate it in other ways)
    const surveyId = `survey-${Date.now()}`;

    // Create a new survey instance
    const newSurvey = new SurveyModel({ title, description, category, filters, sections, releaseDate, surveyId });
    await newSurvey.save();

    // Send back the created survey as a response
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

// Get survey by ID
export const getSurveyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the survey by its ID
    const survey = await SurveyModel.findById(id);

    // If no survey is found, return a 404 error
    if (!survey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }

    // Return the found survey
    res.status(200).json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSurvey = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Extract the survey ID from the route parameter

  try {
    console.log("ID received for deletion:", id); // Log the ID for debugging

    // Attempt to delete the survey
    const deletedSurvey = await SurveyModel.findByIdAndDelete(id);

    // If no survey is found, return a 404 error
    if (!deletedSurvey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }

    // Respond with success
    res.status(200).json({ message: 'Survey deleted successfully.', survey: deletedSurvey });
  } catch (error) {
    // Handle errors and respond
    console.error("Error deleting survey:", error);
    res.status(500).json({ message: 'Error deleting survey', error: (error as Error).message });
  }
};

export const completeSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Extract survey ID from the request

    // Find the survey by ID and update its status to "completed"
    const updatedSurvey = await SurveyModel.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true } // Return the updated document
    );

    // If no survey is found, return a 404 error
    if (!updatedSurvey) {
      res.status(404).json({ message: "Survey not found" });
      return;
    }

    // Respond with the updated survey
    res.status(200).json({ message: "Survey marked as completed", survey: updatedSurvey });
  } catch (error) {
    console.error("Error updating survey status:", error);
    res.status(500).json({ message: "Error updating survey status", error: (error as Error).message });
  }
};
