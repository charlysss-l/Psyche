import { Request, Response } from 'express';
import UserIQTest from '../models/UserIQTestSchema';

// Controller to handle creating a new IQ test result
export const createIQTestResult = async (req: Request, res: Response) => {
    try {
        const { userID, testID, responses, interpretation, testType, testDate } = req.body;

        // Validate required fields
        if (!userID || !testID || !responses) {
            res.status(400).json({ error: 'Missing required fields: userID, testID, or responses' });
            return ;
        }

        // Create new IQ test record
        const newTestResult = new UserIQTest({
            userID,
            testID,
            responses,
            interpretation,
            testType,
            testDate
        });

        // Save the result to the database
        await newTestResult.save();

        res.status(201).json({ message: 'IQ Test result saved successfully', newTestResult });
    } catch (error) {
        res.status(500).json({ error: 'Error saving test result', details: error });
    }
};

// Controller to retrieve all IQ test results for a user
export const getIQTestResultsByUser = async (req: Request, res: Response) => {
    try {
        const { userID } = req.params;

        // Find all tests for the given user
        const testResults = await UserIQTest.find({ userID });

        res.status(200).json(testResults);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving test results', details: error });
    }
};

// Controller to retrieve a specific IQ test result
export const getIQTestResultById = async (req: Request, res: Response) => {
    try {
        const { testID } = req.params;

        // Find the test result by ID
        const testResult = await UserIQTest.findOne({ testID });

        if (!testResult) {
            res.status(404).json({ error: 'Test result not found' });
            return ;
        }

        res.status(200).json(testResult);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving test result', details: error });
    }
};

// Controller to update an IQ test result
export const updateIQTestResult = async (req: Request, res: Response) => {
    try {
        const { testID } = req.params;
        const updatedData = req.body;

        // Find and update the test result by ID
        const updatedTestResult = await UserIQTest.findOneAndUpdate({ testID }, updatedData, { new: true });

        if (!updatedTestResult) {
           res.status(404).json({ error: 'Test result not found' });
           return ;
        }

        res.status(200).json({ message: 'Test result updated successfully', updatedTestResult });
    } catch (error) {
        res.status(500).json({ error: 'Error updating test result', details: error });
    }
};

// Controller to delete an IQ test result
export const deleteIQTestResult = async (req: Request, res: Response) => {
    try {
        const { testID } = req.params;

        // Find and delete the test result
        const deletedTestResult = await UserIQTest.findOneAndDelete({ testID });

        if (!deletedTestResult) {
            res.status(404).json({ error: 'Test result not found' });
            return ;
        }

        res.status(200).json({ message: 'Test result deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting test result', details: error });
    }
};
