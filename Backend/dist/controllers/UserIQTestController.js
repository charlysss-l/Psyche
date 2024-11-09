"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIQTestResult = exports.updateIQTestResult = exports.getIQTestResultById = exports.getIQTestResultsByUser = exports.createIQTestResult = void 0;
const UserIQTestSchema_1 = __importDefault(require("../models/UserIQTestSchema"));
// Controller to handle creating a new IQ test result
const createIQTestResult = async (req, res) => {
    const { userID, firstName, lastName, age, sex, testID, responses, interpretation, testType, testDate } = req.body;
    try {
        // Validate required fields
        if (!userID || !firstName || !lastName || !age || !sex || !testID || !responses || !interpretation || !testType || !testDate) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        // Process responses and calculate total score
        let totalScore = 0;
        const mappedResponses = responses.map((response) => {
            if (!response.questionID || !response.selectedChoice) {
                throw new Error('questionID and selectedChoice are required in each response');
            }
            const isCorrect = response.isCorrect;
            if (isCorrect)
                totalScore += 1; // Increment score for each correct answer
            return {
                questionID: response.questionID,
                selectedChoice: response.selectedChoice,
                isCorrect,
            };
        });
        // Prepare interpretation object
        const testInterpretation = {
            ageRange: interpretation.ageRange,
            sex: interpretation.sex,
            minTestScore: interpretation.minTestScore,
            maxTestScore: interpretation.maxTestScore,
            percentilePoints: interpretation.percentilePoints,
            resultInterpretation: interpretation.resultInterpretation,
        };
        // Create and save the test document
        const testDocument = new UserIQTestSchema_1.default({
            userID,
            firstName,
            lastName,
            age,
            sex,
            testID,
            responses: mappedResponses,
            interpretation: testInterpretation,
            totalScore, // Pass totalScore directly
            testType,
            testDate,
        });
        await testDocument.save();
        res.status(201).json({ message: 'IQ Test result saved successfully', data: testDocument });
    }
    catch (error) {
        console.error('Error creating IQ test result:', error);
        res.status(500).json({
            message: 'Error saving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.createIQTestResult = createIQTestResult;
// Controller to retrieve all IQ test results for a user
const getIQTestResultsByUser = async (req, res) => {
    try {
        const allUserIQTests = await UserIQTestSchema_1.default.find();
        res.status(200).json({ data: allUserIQTests });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching IQ tests', error: errorMessage });
    }
};
exports.getIQTestResultsByUser = getIQTestResultsByUser;
// Controller to retrieve a specific IQ test result
const getIQTestResultById = async (req, res) => {
    const { id } = req.params;
    try {
        const testResult = await UserIQTestSchema_1.default.findById(id);
        if (!testResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: testResult });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.getIQTestResultById = getIQTestResultById;
// Controller to update an IQ test result
const updateIQTestResult = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedIQTestResult = await UserIQTestSchema_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedIQTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ message: 'IQ test result updated successfully', data: updatedIQTestResult });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.updateIQTestResult = updateIQTestResult;
// Controller to delete an IQ test result
const deleteIQTestResult = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedIQTestResult = await UserIQTestSchema_1.default.findByIdAndDelete(id);
        if (!deletedIQTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ message: 'IQ test result deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.deleteIQTestResult = deleteIQTestResult;
