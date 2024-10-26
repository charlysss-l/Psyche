"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIQTestById = exports.updateIQTestById = exports.getIQTestById = exports.getAllIQTests = exports.createIQTest = void 0;
const IQTestSchema_1 = __importDefault(require("../models/IQTestSchema"));
// Create a new IQTest
const createIQTest = async (req, res) => {
    try {
        const { testID, nameOfTest, numOfQuestions, questions, interpretation } = req.body;
        const newIQTest = new IQTestSchema_1.default({
            testID,
            nameOfTest,
            numOfQuestions,
            questions,
            interpretation
        });
        await newIQTest.save();
        res.status(201).json({ message: 'IQ Test created successfully', iqTest: newIQTest });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating IQ Test', error });
    }
};
exports.createIQTest = createIQTest;
// Get all IQ Tests
const getAllIQTests = async (req, res) => {
    try {
        const iqTests = await IQTestSchema_1.default.find();
        res.status(200).json(iqTests);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching IQ Tests', error });
    }
};
exports.getAllIQTests = getAllIQTests;
// Get a single IQTest by ID
const getIQTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const iqTest = await IQTestSchema_1.default.findById(id);
        if (!iqTest) {
            res.status(404).json({ message: 'IQ Test not found' });
            return; // Prevent further code execution
        }
        res.status(200).json(iqTest);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching IQ Test', error });
    }
};
exports.getIQTestById = getIQTestById;
// Update an IQTest by ID
const updateIQTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedIQTest = await IQTestSchema_1.default.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedIQTest) {
            res.status(404).json({ message: 'IQ Test not found' });
            return; // Prevent further code execution
        }
        res.status(200).json({ message: 'IQ Test updated successfully', iqTest: updatedIQTest });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating IQ Test', error });
    }
};
exports.updateIQTestById = updateIQTestById;
// Delete an IQTest by ID
const deleteIQTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedIQTest = await IQTestSchema_1.default.findByIdAndDelete(id);
        if (!deletedIQTest) {
            res.status(404).json({ message: 'IQ Test not found' });
            return; // Prevent further code execution
        }
        res.status(200).json({ message: 'IQ Test deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting IQ Test', error });
    }
};
exports.deleteIQTestById = deleteIQTestById;
