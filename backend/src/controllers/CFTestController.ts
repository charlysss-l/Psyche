import { RequestHandler } from 'express';
import CFTest from '../models/CFTestSchema';

// Create a new CFTest
export const createCFTest: RequestHandler = async (req, res) => {
    try {
        const { testID, nameOfTest, numOfQuestions, questions, interpretation } = req.body;

        const newCFTest = new CFTest({
            testID,
            nameOfTest,
            numOfQuestions,
            questions,
            interpretation
        });

        await newCFTest.save();

        res.status(201).json({ message: 'CF Test created successfully', cfTest: newCFTest });
    } catch (error) {
        res.status(500).json({ message: 'Error creating CF Test', error });
    }
};

// Get all CF Tests
export const getAllCFTests: RequestHandler = async (req, res) => {
    try {
        const cfTests = await CFTest.find();
        res.status(200).json(cfTests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching CF Tests', error });
    }
};

// Get a single CFTest by ID
export const getCFTestById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const cfTest = await CFTest.findById(id);

        if (!cfTest) {
            res.status(404).json({ message: 'CF Test not found' });
            return; // Prevent further code execution
        }

        res.status(200).json(cfTest);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching CF Test', error });
    }
};

// Update an CFTest by ID
export const updateCFTestById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedCFTest = await CFTest.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCFTest) {
            res.status(404).json({ message: 'CF Test not found' });
            return; // Prevent further code execution
        }

        res.status(200).json({ message: 'CF Test updated successfully', cfTest: updatedCFTest });
    } catch (error) {
        res.status(500).json({ message: 'Error updating CF Test', error });
    }
};


// Delete an CFTest by ID
export const deleteCFTestById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCFTest = await CFTest.findByIdAndDelete(id);

        if (!deletedCFTest) {
            res.status(404).json({ message: 'CF Test not found' });
            return; // Prevent further code execution
        }

        res.status(200).json({ message: 'CF Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting CF Test', error });
    }
};

// Update a specific question within an CFTest
export const updateQuestionById: RequestHandler = async (req, res) => {
    try {
        const { id, questionID } = req.params; // Get CFTest ID and questionID from request params
        const updatedData = req.body; // Get the updated data from the request body

        // Find the CFTest by ID
        const cfTest = await CFTest.findById(id);
        if (!cfTest) {
            res.status(404).json({ message: 'CF Test not found' });
            return; // End execution if CFTest not found
        }

        // Find the question in the questions array by questionID
        const questionIndex = cfTest.questions.findIndex(
            (question) => question.questionID === questionID
        );

        if (questionIndex === -1) {
            res.status(404).json({ message: 'Question not found' });
            return; // End execution if question not found
        }

        // Update the question at the found index
        cfTest.questions[questionIndex] = {
            ...cfTest.questions[questionIndex],
            ...updatedData, // Merge updated data into the existing question
        };

        // Save the updated CFTest document
        await cfTest.save();

        // Respond with the updated CFTest
        res.status(200).json({
            message: 'Question updated successfully',
            cfTest,
        });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error updating question', error });
    }
};




// Update a specific interpretation within an CFTest
export const updateInterpretationBySpecificId: RequestHandler = async (req, res) => {
    try {
        const { id, interpretationId } = req.params;
        const updatedData = req.body;

        const cfTest = await CFTest.findById(id);
        if (!cfTest) {
            res.status(404).json({ message: 'CF Test not found' });
            return; // End execution early if not found
        }

        const interpretationIndex = cfTest.interpretation.findIndex(
            (interpretation) => interpretation.byId === interpretationId
        );

        if (interpretationIndex === -1) {
            res.status(404).json({ message: 'Interpretation not found' });
            return; // End execution early if interpretation not found
        }

        // Update the interpretation at the found index
        cfTest.interpretation[interpretationIndex] = {
            ...cfTest.interpretation[interpretationIndex],
            ...updatedData,
        };

        // Save the updated CFTest document
        await cfTest.save();

        // Respond with the updated CFTest
        res.status(200).json({
            message: 'Interpretation updated successfully',
            cfTest,
        });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error updating interpretation', error });
    }
};