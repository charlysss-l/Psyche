import { RequestHandler } from 'express';
import IQTest from '../models/IQTestSchema';

// Create a new IQTest
export const createIQTest: RequestHandler = async (req, res) => {
    try {
        const { testID, nameOfTest, numOfQuestions, questions, interpretation } = req.body;

        const newIQTest = new IQTest({
            testID,
            nameOfTest,
            numOfQuestions,
            questions,
            interpretation
        });

        await newIQTest.save();

        res.status(201).json({ message: 'IQ Test created successfully', iqTest: newIQTest });
    } catch (error) {
        res.status(500).json({ message: 'Error creating IQ Test', error });
    }
};

// Get all IQ Tests
export const getAllIQTests: RequestHandler = async (req, res) => {
    try {
        const iqTests = await IQTest.find();
        res.status(200).json(iqTests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching IQ Tests', error });
    }
};

// Get a single IQTest by ID
export const getIQTestById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const iqTest = await IQTest.findById(id);

        if (!iqTest) {
            res.status(404).json({ message: 'IQ Test not found' });
            return; // Prevent further code execution
        }

        res.status(200).json(iqTest);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching IQ Test', error });
    }
};

// Update an IQTest by ID
export const updateIQTestById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedIQTest = await IQTest.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedIQTest) {
            res.status(404).json({ message: 'IQ Test not found' });
            return; // Prevent further code execution
        }

        res.status(200).json({ message: 'IQ Test updated successfully', iqTest: updatedIQTest });
    } catch (error) {
        res.status(500).json({ message: 'Error updating IQ Test', error });
    }
};

// Delete an IQTest by ID
export const deleteIQTestById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedIQTest = await IQTest.findByIdAndDelete(id);

        if (!deletedIQTest) {
            res.status(404).json({ message: 'IQ Test not found' });
            return; // Prevent further code execution
        }

        res.status(200).json({ message: 'IQ Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting IQ Test', error });
    }
};

// Update a specific interpretation within an IQTest
export const updateInterpretationBySpecificId: RequestHandler = async (req, res) => {
    try {
        const { id, interpretationId } = req.params;
        const updatedData = req.body;

        const iqTest = await IQTest.findById(id);
        if (!iqTest) {
            res.status(404).json({ message: 'IQ Test not found' });
            return; // End execution early if not found
        }

        const interpretationIndex = iqTest.interpretation.findIndex(
            (interpretation) => interpretation.byId === interpretationId
        );

        if (interpretationIndex === -1) {
            res.status(404).json({ message: 'Interpretation not found' });
            return; // End execution early if interpretation not found
        }

        // Update the interpretation at the found index
        iqTest.interpretation[interpretationIndex] = {
            ...iqTest.interpretation[interpretationIndex],
            ...updatedData,
        };

        // Save the updated IQTest document
        await iqTest.save();

        // Respond with the updated IQTest
        res.status(200).json({
            message: 'Interpretation updated successfully',
            iqTest,
        });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error updating interpretation', error });
    }
};