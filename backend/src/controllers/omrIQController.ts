import { Request, Response } from 'express';
import OmrSchema from '../models/omrIQSchema';
import { Interpretation } from '../models/omrIQSchema';

// Controller to handle creating a new IQ test result
export const createOmrResult = async (req: Request, res: Response) => {
    const { userID, firstName, lastName, age, sex, course, year, section, totalScore, interpretation, testType, testDate } = req.body;

    try {
        // Validate required fields
        if (!userID || !firstName || !lastName || !age || !sex || !course || !year || !section  || !totalScore || !interpretation || !testType || !testDate) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const testID = `${userID}-${Date.now()}`;


        
        

        // Prepare interpretation object
        const testInterpretation: Interpretation = {
            
            resultInterpretation: interpretation.resultInterpretation,
        };

// Create and save the test document
const testDocument = new OmrSchema({
    userID,
    firstName,
    lastName,
    age,
    sex,
    course,
    year,
    section,
    testID,
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
export const getIQTestResultsByAll = async (req: Request, res: Response) => {
    
    try {
        const allUserIQTests = await OmrSchema.find();
        res.status(200).json({ data: allUserIQTests });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching IQ tests', error: errorMessage });
    }
};

// Controller to retrieve all IQ test results for a user
export const getOmrResultsByUser = async (req: Request, res: Response) => {
    const { userID } = req.params;

    try {
        const testResult = await OmrSchema.find({ userID });
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

// Controller to retrieve a specific IQ test result
export const getOmrResultById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const testResult = await OmrSchema.findById(id);
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

// Controller to update an IQ test result by testID
export const updateOmrResult = async (req: Request, res: Response) => {
    const { testID } = req.params; // Extract testID from the request parameters

    try {
        // Find and update the test document using testID
        const updatedIQTestResult = await OmrSchema.findOneAndUpdate(
            { testID }, // Find the document with the matching testID
            req.body,   // Apply the updates from the request body
            { new: true } // Return the updated document
        );

        if (!updatedIQTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }

        res.status(200).json({
            message: 'IQ test result updated successfully',
            data: updatedIQTestResult,
        });
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Error updating IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};


// Controller to delete an IQ test result
export const deleteOmrResult = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedIQTestResult = await  OmrSchema.findOneAndDelete({userID : id});
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