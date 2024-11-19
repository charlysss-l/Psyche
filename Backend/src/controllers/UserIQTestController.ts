import { Request, Response } from 'express';
import UserIQTest from '../models/UserIQTestSchema';
import { Interpretation, Response as IQResponse } from '../models/UserIQTestSchema';

// Controller to handle creating a new IQ test result
export const createIQTestResult = async (req: Request, res: Response) => {
    const { userID, firstName, lastName, age, sex, course, year, section, responses,  interpretation, testType, testDate } = req.body;

    try {
        // Validate required fields
        if (!userID || !firstName || !lastName || !age || !sex || !course || !year || !section  || !responses || !interpretation || !testType || !testDate) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const testID = `${userID}-${Date.now()}`;


        // Process responses and calculate total score
        let totalScore = 0;
        const mappedResponses = responses.map((response: any) => {
            if (!response.questionID || !response.selectedChoice) {
                throw new Error('questionID and selectedChoice are required in each response');
            }

            const isCorrect = response.isCorrect;
            if (isCorrect) totalScore += 1; // Increment score for each correct answer

            return {
                questionID: response.questionID,
                selectedChoice: response.selectedChoice,
                isCorrect,
            };
        });

        

        // Prepare interpretation object
        const testInterpretation: Interpretation = {

            minAge: interpretation.minAge,
            maxAge: interpretation.maxAge,
            minTestScore: interpretation.minTestScore,
            maxTestScore: interpretation.maxTestScore,
            percentilePoints: interpretation.percentilePoints,
            resultInterpretation: interpretation.resultInterpretation,
        };

// Create and save the test document
const testDocument = new UserIQTest({
    userID,
    firstName,
    lastName,
    age,
    sex,
    course,
    year,
    section,
    testID,
    responses: mappedResponses,
    interpretation: testInterpretation,
    totalScore,  // Pass totalScore directly
    testType,
    testDate,
});




        await testDocument.save();
        res.status(201).json({ message: 'IQ Test result saved successfully', data: testDocument });

    } catch (error) {
        console.error('Error creating IQ test result:', error);
        res.status(500).json({
            message: 'Error saving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
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
        const deletedIQTestResult = await UserIQTest.findOneAndDelete({userID : id});
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
