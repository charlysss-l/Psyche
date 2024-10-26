"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIQTestResult = exports.updateIQTestResult = exports.getIQTestResultById = exports.getIQTestResultsByUser = exports.createIQTestResult = void 0;
const UserIQTestSchema_1 = __importDefault(require("../models/UserIQTestSchema"));
// Controller to handle creating a new IQ test result
const createIQTestResult = async (req, res) => {
    try {
        const { userID, testID, responses, interpretation, testType, testDate } = req.body;
        // Validate required fields
        if (!userID || !testID || !responses) {
            res.status(400).json({ error: 'Missing required fields: userID, testID, or responses' });
            return;
        }
        // Create new IQ test record
        const newTestResult = new UserIQTestSchema_1.default({
            userID,
            testID,
            responses,
            interpretation,
            testType,
            testDate
        });
        // Save the result to the database
        await newTestResult.save();
        res.status(201).json({ message: 'IQ Test result saved successfully', newTestResult });
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving test result', details: error });
    }
};
exports.createIQTestResult = createIQTestResult;
// Controller to retrieve all IQ test results for a user
const getIQTestResultsByUser = async (req, res) => {
    try {
        const allUserIQtests = await UserIQTestSchema_1.default.find();
        res.status(200).json({ data: allUserIQtests });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching tests', error: errorMessage });
    }
};
exports.getIQTestResultsByUser = getIQTestResultsByUser;
// Controller to retrieve a specific IQ test result
const getIQTestResultById = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the test result by ID
        const testResult = await UserIQTestSchema_1.default.findById(id);
        if (!testResult) {
            res.status(404).json({ error: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: testResult });
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving test result', details: error });
    }
};
exports.getIQTestResultById = getIQTestResultById;
// Controller to update an IQ test result
const updateIQTestResult = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUserIQTest = await UserIQTestSchema_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUserIQTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: 'Test updated successfully', data: updatedUserIQTest });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error updating user test', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error updating user test', error: 'An unknown error occurred' });
        }
    }
};
exports.updateIQTestResult = updateIQTestResult;
// Controller to delete an IQ test result
const deleteIQTestResult = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUserIQTest = await UserIQTestSchema_1.default.findByIdAndDelete(id);
        if (!deletedUserIQTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: 'User 16PF Test deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user test', error: error.message });
    }
};
exports.deleteIQTestResult = deleteIQTestResult;
