import { Request, Response } from 'express';
import UserCFTest from '../models/UserCFTestSchema';
import { Interpretation } from '../models/UserCFTestSchema';

export const createCFTestResult = async (req: Request, res: Response) => {
    
    const { userID, firstName, lastName, age, sex, course, year, section, responses, interpretation, testType, testDate } = req.body;

    try {
        if (!userID || !firstName || !lastName || !age || !sex || !course || !year || !section || !responses || !interpretation || !testType || !testDate) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Check if a test exists for this user on the same day
        const existingTest = await UserCFTest.findOne({
            userID,
            testDate: { $gte: startOfDay, $lte: endOfDay },
        });

        if (existingTest) {
            return res.status(400).json({
                message: 'You have already taken the test today. Please try again tomorrow.',
            });
        }

        const testID = `${userID}-${Date.now()}`;

        // Process responses and calculate total score
        let totalScore = 0;
        const mappedResponses = responses.map((response: any) => {
            if (!response.questionID || !response.selectedChoice) {
                throw new Error('questionID and selectedChoice are required in each response');
            }

            const isCorrect = response.isCorrect;
            if (isCorrect) totalScore += 1;

            return {
                questionID: response.questionID,
                selectedChoice: response.selectedChoice,
                isCorrect,
            };
        });

        // Prepare interpretation object
        const testInterpretation: Interpretation = {
            resultInterpretation: interpretation.resultInterpretation,
        };

        // Create and save the test document
        const testDocument = new UserCFTest({
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
            totalScore,
            testType,
            testDate,
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
        const allUserCFTests = await UserCFTest.find();
        res.status(200).json({ data: allUserCFTests });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching CF tests', error: errorMessage });
    }
};

// Controller to retrieve all CF test results for a user
export const getCFTestResultsByUserID = async (req: Request, res: Response) => {
    const { userID } = req.params;

    try {
        const testResult = await UserCFTest.find({ userID });
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
export const getCFTestResultsByTestID = async (req: Request, res: Response) => {
    const { testID } = req.params;

    try {
        const testResult = await UserCFTest.find({ testID });
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
export const getCFTestResultById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const testResult = await UserCFTest.findById(id);
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

// Controller to update an CF test result
export const updateCFTestResult = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedCFTestResult = await UserCFTest.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCFTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ message: 'CF test result updated successfully', data: updatedCFTestResult });
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Error updating CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

// Controller to delete an CF test result by testID
export const deleteCFTestResult = async (req: Request, res: Response) => {
    const { id } = req.params; // `id` here is the testID
    try {
      const deletedCFTestResult = await UserCFTest.findOneAndDelete({ testID: id });
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
  



// Archive Controller to archive an CF test result



// Controller to archive an CF test result
export const archiveCFTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await UserCFTest.findOne({ testID: testID });

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




// Controller for fetching archived CF test results
export const getArchivedCFTests = async (req: Request, res: Response) => {
    try {
        const archivedTests = await UserCFTest.find({ isArchived: true });
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
    const consultationRequest = await UserCFTest.findOne({ testID });
    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    // Delete the consultation request
    await UserCFTest.deleteOne({ testID });

    res.status(200).json({ message: 'Consultation request deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting consultation request',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

// Controller to unarchive an CF test result
export const unarchiveCFTestResult = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const testResult = await UserCFTest.findById(id);
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Mark the test result as not archived
        testResult.isArchived = false;

        await testResult.save();
        res.status(200).json({ message: 'CF test result unarchived successfully', data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error unarchiving CF test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};