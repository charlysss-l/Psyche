import { Request, Response } from 'express';
import OmrSchema from '../models/omrIQSchema';
import { Interpretation } from '../models/omrIQSchema';

// Controller to handle creating a new IQ test result
export const createOmrResult = async (req: Request, res: Response) => {
    const { userID, firstName, lastName, age, sex, course, year, section, totalScore, interpretation, testType, testDate, uploadURL } = req.body;

    try {
        // Validate required fields
        if (!userID || !firstName || !lastName || !age || !sex || !course || !year || !section  || !totalScore || !interpretation || !testType || !testDate || !uploadURL) {
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
    uploadURL
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

// Controller to retrieve all IQ test results for a user
export const getOmrResultsByTestID = async (req: Request, res: Response) => {
    const { testID } = req.params;

    try {
        const testResult = await OmrSchema.find({ testID });
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
    const { id } = req.params; // `id` here is the testID
    try {
      const deletedIQTestResult = await OmrSchema.findOneAndDelete({ testID: id });
      if (!deletedIQTestResult) {
        res.status(404).json({ message: 'Test result not found' });
        return;
      }
      res.status(200).json({ message: 'IQ test result deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting IQ test result',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  







// for archiving IQ test results

// Controller to archive an IQ test result
export const archiveIQTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await OmrSchema.findOne({ testID: testID });

        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Mark the test result as archived
        testResult.isArchived = true; // Assuming there's an `isArchived` field

        await testResult.save();
        res.status(200).json({ message: 'IQ test result archived successfully', data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error archiving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};




// Controller for fetching archived IQ test results
export const getArchivedIQTests = async (req: Request, res: Response) => {
    try {
        const archivedTests = await OmrSchema.find({ isArchived: true });
        console.log('Archived tests:', archivedTests);  // This logs the archived tests to check if they're being returned

        if (archivedTests.length === 0) {
            return res.status(404).json({ message: 'No archived test results found' });
        }

        res.status(200).json({ message: 'Archived IQ test results fetched successfully', data: archivedTests });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching archived IQ test results',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};






export const deleteArchivedIQTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
  try {
    const consultationRequest = await OmrSchema.findOne({ testID });
    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    // Delete the consultation request
    await OmrSchema.deleteOne({ testID });

    res.status(200).json({ message: 'Consultation request deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting consultation request',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};