import { Request, Response } from 'express';
import OmrCFSchema from '../models/omrCFSchema';
import { Interpretation } from '../models/omrCFSchema';

// Controller to handle creating a new CF test result
export const createOmrCFResult = async (req: Request, res: Response) => {
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
const testDocument = new OmrCFSchema({
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
        res.status(201).json({ message: 'CF Test result saved successfully', data: testDocument });

    } catch (error) {
        console.error('Error creating CF test result:', error);
        res.status(500).json({
            message: 'Error saving CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};


// Controller to retrieve all CF test results for a user
export const getCFTestResultsByAll = async (req: Request, res: Response) => {
    
    try {
        const allUserCFTests = await OmrCFSchema.find();
        res.status(200).json({ data: allUserCFTests });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching CF tests', error: errorMessage });
    }
};

// Controller to retrieve all CF test results for a user
export const getOmrCFResultsByUser = async (req: Request, res: Response) => {
    const { userID } = req.params;

    try {
        const testResult = await OmrCFSchema.find({ userID });
        if (!testResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

// Controller to retrieve all CF test results for a user
export const getOmrCFResultsByTestID = async (req: Request, res: Response) => {
    const { testID } = req.params;

    try {
        const testResult = await OmrCFSchema.find({ testID });
        if (!testResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

// Controller to retrieve a specific CF test result
export const getOmrCFResultById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const testResult = await OmrCFSchema.findById(id);
        if (!testResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

// Controller to update an CF test result by testID
export const updateOmrCFResult = async (req: Request, res: Response) => {
    const { testID } = req.params; // Extract testID from the request parameters

    try {
        // Find and update the test document using testID
        const updatedCFTestResult = await OmrCFSchema.findOneAndUpdate(
            { testID }, // Find the document with the matching testID
            req.body,   // Apply the updates from the request body
            { new: true } // Return the updated document
        );

        if (!updatedCFTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }

        res.status(200).json({
            message: 'CF test result updated successfully',
            data: updatedCFTestResult,
        });
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Error updating CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};


// Controller to delete an CF test result
export const deleteOmrCFResult = async (req: Request, res: Response) => {
    const { id } = req.params; // `id` here is the testID
    try {
      const deletedCFTestResult = await OmrCFSchema.findOneAndDelete({ testID: id });
      if (!deletedCFTestResult) {
        res.status(404).json({ message: 'Test result not found' });
        return;
      }
      res.status(200).json({ message: 'CF test result deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting CF test result',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  







// for archiving CF test results

// Controller to archive an CF test result
export const archiveCFTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await OmrCFSchema.findOne({ testID: testID });

        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Mark the test result as archived
        testResult.isArchived = true; // Assuming there's an `isArchived` field

        await testResult.save();
        res.status(200).json({ message: 'CF test result archived successfully', data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error archiving CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const unarchiveCFTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await OmrCFSchema.findOne({ testID: testID });

        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Mark the test result as archived
        testResult.isArchived = false; // Assuming there's an `isArchived` field

        await testResult.save();
        res.status(200).json({ message: 'IQ test result archived successfully', data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error archiving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};



// Controller for fetching archived CF test results
export const getArchivedCFTests = async (req: Request, res: Response) => {
    try {
        const archivedTests = await OmrCFSchema.find({ isArchived: true });
        console.log('Archived tests:', archivedTests);  // This logs the archived tests to check if they're being returned

        if (archivedTests.length === 0) {
            return res.status(404).json({ message: 'No archived test results found' });
        }

        res.status(200).json({ message: 'Archived CF test results fetched successfully', data: archivedTests });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching archived CF test results',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};






export const deleteArchivedCFTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
  try {
    const consultationRequest = await OmrCFSchema.findOne({ testID });
    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    // Delete the consultation request
    await OmrCFSchema.deleteOne({ testID });

    res.status(200).json({ message: 'Consultation request deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting consultation request',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};