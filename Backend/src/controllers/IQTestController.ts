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
