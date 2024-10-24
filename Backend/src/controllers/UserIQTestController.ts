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
        const allUserIQtests = await UserIQTest.find();
        res.status(200).json({data:allUserIQtests });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching tests', error: errorMessage });
    }
};

// Controller to retrieve a specific IQ test result
export const getIQTestResultById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {

        // Find the test result by ID
        const testResult = await UserIQTest.findById(id);

        if (!testResult) {
            res.status(404).json({ error: 'Test result not found' });
            return ;
        }

        res.status(200).json({data : testResult});
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving test result', details: error });
    }
};

// Controller to update an IQ test result
export const updateIQTestResult = async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const updatedUserIQTest = await UserIQTest.findByIdAndUpdate(id, req.body, {new:true});
        if(!updatedUserIQTest){
            res.status(404).json({message: 'Test not found'});
            return;
        }
        res.status(200).json({message: 'Test updated successfully', data: updatedUserIQTest})
    } catch (error: unknown){
        if (error instanceof Error){
            res.status(500).json({message:'Error updating user test', error: error.message})
        } else{
            res.status(500).json({message:'Error updating user test', error: 'An unknown error occurred'})
        }
    }
};

// Controller to delete an IQ test result
export const deleteIQTestResult = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedUserIQTest = await UserIQTest.findByIdAndDelete(id);
        if (!deletedUserIQTest) {
         res.status(404).json({ message: 'Test not found' });
         return;
        }
        res.status(200).json({ message: 'User 16PF Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user test', error: (error as Error).message });
    }
};