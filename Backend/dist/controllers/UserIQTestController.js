"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unarchiveIQTestResult = exports.deleteArchivedIQTestResult = exports.getArchivedIQTests = exports.archiveIQTestResult = exports.deleteIQTestResult = exports.updateIQTestResult = exports.getIQTestResultById = exports.getIQTestResultsByTestID = exports.getIQTestResultsByUserID = exports.getIQTestResultsByAll = exports.createIQTestResult = void 0;
const UserIQTestSchema_1 = __importDefault(require("../models/UserIQTestSchema"));
const createIQTestResult = async (req, res) => {
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
        const existingTest = await UserIQTestSchema_1.default.findOne({
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
        const mappedResponses = responses.map((response) => {
            if (!response.questionID || !response.selectedChoice) {
                throw new Error('questionID and selectedChoice are required in each response');
            }
            const isCorrect = response.isCorrect;
            if (isCorrect)
                totalScore += 1;
            return {
                questionID: response.questionID,
                selectedChoice: response.selectedChoice,
                isCorrect,
            };
        });
        // Prepare interpretation object
        const testInterpretation = {
            resultInterpretation: interpretation.resultInterpretation,
        };
        // Create and save the test document
        const testDocument = new UserIQTestSchema_1.default({
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
const getIQTestResultsByAll = async (req, res) => {
    try {
        const allUserIQTests = await UserIQTestSchema_1.default.find();
        res.status(200).json({ data: allUserIQTests });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching IQ tests', error: errorMessage });
    }
};
exports.getIQTestResultsByAll = getIQTestResultsByAll;
// Controller to retrieve all IQ test results for a user
const getIQTestResultsByUserID = async (req, res) => {
    const { userID } = req.params;
    try {
        const testResult = await UserIQTestSchema_1.default.find({ userID });
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
exports.getIQTestResultsByUserID = getIQTestResultsByUserID;
// Controller to retrieve all IQ test results for a user
const getIQTestResultsByTestID = async (req, res) => {
    const { testID } = req.params;
    try {
        const testResult = await UserIQTestSchema_1.default.find({ testID });
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
exports.getIQTestResultsByTestID = getIQTestResultsByTestID;
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
// Controller to delete an IQ test result by testID
const deleteIQTestResult = async (req, res) => {
    const { id } = req.params; // `id` here is the testID
    try {
        const deletedIQTestResult = await UserIQTestSchema_1.default.findOneAndDelete({ testID: id });
        if (!deletedIQTestResult) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ message: 'IQ test result deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.deleteIQTestResult = deleteIQTestResult;
// Archive Controller to archive an IQ test result
// Controller to archive an IQ test result
const archiveIQTestResult = async (req, res) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await UserIQTestSchema_1.default.findOne({ testID: testID });
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        // Mark the test result as archived
        testResult.isArchived = true; // Assuming there's an `isArchived` field
        await testResult.save();
        res.status(200).json({ message: 'IQ test result archived successfully', data: testResult });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error archiving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.archiveIQTestResult = archiveIQTestResult;
// Controller for fetching archived IQ test results
const getArchivedIQTests = async (req, res) => {
    try {
        const archivedTests = await UserIQTestSchema_1.default.find({ isArchived: true });
        console.log('Archived tests:', archivedTests); // This logs the archived tests to check if they're being returned
        if (archivedTests.length === 0) {
            return res.status(404).json({ message: 'No archived test results found' });
        }
        res.status(200).json({ message: 'Archived IQ test results fetched successfully', data: archivedTests });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching archived IQ test results',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.getArchivedIQTests = getArchivedIQTests;
const deleteArchivedIQTestResult = async (req, res) => {
    const { testID } = req.params;
    try {
        const consultationRequest = await UserIQTestSchema_1.default.findOne({ testID });
        if (!consultationRequest) {
            return res.status(404).json({ message: 'Consultation request not found' });
        }
        // Delete the consultation request
        await UserIQTestSchema_1.default.deleteOne({ testID });
        res.status(200).json({ message: 'Consultation request deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting consultation request',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.deleteArchivedIQTestResult = deleteArchivedIQTestResult;
// Controller to unarchive an IQ test result
const unarchiveIQTestResult = async (req, res) => {
    const { id } = req.params;
    try {
        const testResult = await UserIQTestSchema_1.default.findById(id);
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        // Mark the test result as not archived
        testResult.isArchived = false;
        await testResult.save();
        res.status(200).json({ message: 'IQ test result unarchived successfully', data: testResult });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error unarchiving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.unarchiveIQTestResult = unarchiveIQTestResult;
