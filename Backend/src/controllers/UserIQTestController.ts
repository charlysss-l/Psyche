import { Request, Response } from 'express';
import UserIQTest from '../models/UserIQTestSchema';
import { Interpretation, Response as IQResponse } from '../models/UserIQTestSchema';

// Controller to handle creating a new IQ test result
export const createIQTestResult = async (req: Request, res: Response) => {
    const { userID, firstName, lastName, age, sex, testID, responses, interpretation, testType, testDate } = req.body;

    try {
        // Validate that required fields are present
        if (!userID || !firstName || !lastName || !age || !sex || !testID || !responses || !interpretation || !testType || !testDate) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Check that responses array is not empty and contains the required structure
        if (!Array.isArray(responses) || responses.length === 0) {
            res.status(400).json({ message: 'Responses must be a non-empty array' });
            return;
        }

        // Map responses ensuring they contain the necessary fields
        const mappedResponses = responses.map((response: any) => {
            if (!response.questionID || !response.selectedChoice) {
                throw new Error('questionID and selectedChoice are required in each response');
            }
            return {
                questionID: response.questionID,
                selectedChoice: response.selectedChoice,
                isCorrect: response.isCorrect
            };
        });

        // Prepare the interpretation object
        const testInterpretation: Interpretation = {
            ageRange: interpretation.ageRange,
            sex: interpretation.sex,
            minTestScore: interpretation.minTestScore,
            maxTestScore: interpretation.maxTestScore,
            percentilePoints: interpretation.percentilePoints,
            resultInterpretation: interpretation.resultInterpretation
        };

        // Create the test document
        const testDocument = new UserIQTest({
            userID,
            firstName,
            lastName,
            age,
            sex,
            testID,
            responses: mappedResponses,
            interpretation: testInterpretation,
            testType,
            testDate
        });

        // Save the test result to the database
        await testDocument.save();

        res.status(201).json({ message: 'IQ Test result saved successfully', data: testDocument });
    } catch (error) {
        console.error('Error creating IQ test result:', error);
        res.status(500).json({
            message: 'Error saving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            stack: error instanceof Error ? error.stack : undefined // Optional: Include stack trace for debugging
        });
    }
};

// Controller to retrieve all IQ test results for a user
export const getIQTestResultsByUser = async (req: Request, res: Response) => {
    try {
        const allUserIQTests = await UserIQTest.find();
        res.status(200).json({ data: allUserIQTests });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching IQ tests', error: errorMessage });
    }
};

// Controller to retrieve a specific IQ test result
export const getIQTestResultById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const testResult = await UserIQTest.findById(id);
        if (!testResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

// Controller to update an IQ test result
export const updateIQTestResult = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedIQTestResult = await UserIQTest.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedIQTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ message: 'IQ test result updated successfully', data: updatedIQTestResult });
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Error updating IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

// Controller to delete an IQ test result
export const deleteIQTestResult = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedIQTestResult = await UserIQTest.findByIdAndDelete(id);
        if (!deletedIQTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ message: 'IQ test result deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
