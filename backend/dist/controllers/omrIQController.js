"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArchivedIQTestResult = exports.getArchivedIQTests = exports.archiveIQTestResult = exports.deleteOmrResult = exports.updateOmrResult = exports.getOmrResultById = exports.getOmrResultsByTestID = exports.getOmrResultsByUser = exports.getIQTestResultsByAll = exports.createOmrResult = void 0;
const omrIQSchema_1 = __importDefault(require("../models/omrIQSchema"));
// Controller to handle creating a new IQ test result
const createOmrResult = async (req, res) => {
    const { userID, firstName, lastName, age, sex, course, year, section, totalScore, interpretation, testType, testDate, uploadURL } = req.body;
    try {
        // Validate required fields
        if (!userID || !firstName || !lastName || !age || !sex || !course || !year || !section || !totalScore || !interpretation || !testType || !testDate || !uploadURL) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const testID = `${userID}-${Date.now()}`;
        // Prepare interpretation object
        const testInterpretation = {
            resultInterpretation: interpretation.resultInterpretation,
        };
        // Create and save the test document
        const testDocument = new omrIQSchema_1.default({
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
            totalScore, // Pass totalScore directly
            testType,
            testDate,
            uploadURL
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
exports.createOmrResult = createOmrResult;
// Controller to retrieve all IQ test results for a user
const getIQTestResultsByAll = async (req, res) => {
    try {
        const allUserIQTests = await omrIQSchema_1.default.find();
        res.status(200).json({ data: allUserIQTests });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching IQ tests', error: errorMessage });
    }
};
exports.getIQTestResultsByAll = getIQTestResultsByAll;
// Controller to retrieve all IQ test results for a user
const getOmrResultsByUser = async (req, res) => {
    const { userID } = req.params;
    try {
        const testResult = await omrIQSchema_1.default.find({ userID });
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
exports.getOmrResultsByUser = getOmrResultsByUser;
// Controller to retrieve all IQ test results for a user
const getOmrResultsByTestID = async (req, res) => {
    const { testID } = req.params;
    try {
        const testResult = await omrIQSchema_1.default.find({ testID });
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
exports.getOmrResultsByTestID = getOmrResultsByTestID;
// Controller to retrieve a specific IQ test result
const getOmrResultById = async (req, res) => {
    const { id } = req.params;
    try {
        const testResult = await omrIQSchema_1.default.findById(id);
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
exports.getOmrResultById = getOmrResultById;
// Controller to update an IQ test result by testID
const updateOmrResult = async (req, res) => {
    const { testID } = req.params; // Extract testID from the request parameters
    try {
        // Find and update the test document using testID
        const updatedIQTestResult = await omrIQSchema_1.default.findOneAndUpdate({ testID }, // Find the document with the matching testID
        req.body, // Apply the updates from the request body
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.updateOmrResult = updateOmrResult;
// Controller to delete an IQ test result
const deleteOmrResult = async (req, res) => {
    const { id } = req.params; // `id` here is the testID
    try {
        const deletedIQTestResult = await omrIQSchema_1.default.findOneAndDelete({ testID: id });
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
exports.deleteOmrResult = deleteOmrResult;
// for archiving IQ test results
// Controller to archive an IQ test result
const archiveIQTestResult = async (req, res) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await omrIQSchema_1.default.findOne({ testID: testID });
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
        const archivedTests = await omrIQSchema_1.default.find({ isArchived: true });
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
        const consultationRequest = await omrIQSchema_1.default.findOne({ testID });
        if (!consultationRequest) {
            return res.status(404).json({ message: 'Consultation request not found' });
        }
        // Delete the consultation request
        await omrIQSchema_1.default.deleteOne({ testID });
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
