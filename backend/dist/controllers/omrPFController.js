"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArchivedPFTestResult = exports.getArchivedPFTests = exports.archivePFTestResult = exports.deleteOmrResult = exports.updateOmrResult = exports.getOmrResultById = exports.getOmrResultsByTestID = exports.getOmrResultsByUser = exports.getIQTestResultsByAll = exports.createOmrResult = void 0;
const omrPFSchema_1 = __importDefault(require("../models/omrPFSchema"));
const calculateStenScore = (rawScore, factorLetter) => {
    // Factor-specific mappings
    switch (factorLetter) {
        case 'A':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1; // Factor A custom mapping
            }
            else if (rawScore >= 4 && rawScore <= 5) {
                return 2;
            }
            else if (rawScore >= 6 && rawScore <= 8) {
                return 3;
            }
            else if (rawScore >= 9 && rawScore <= 11) {
                return 4;
            }
            else if (rawScore >= 12 && rawScore <= 14) {
                return 5;
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 6;
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 7;
            }
            else if (rawScore === 20) {
                return 8;
            }
            else if (rawScore >= 21 && rawScore <= 22) {
                return 9;
            }
            break;
        case 'B':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1;
            }
            else if (rawScore === 4) {
                return 2;
            }
            else if (rawScore >= 5 && rawScore <= 6) {
                return 3;
            }
            else if (rawScore >= 7 && rawScore <= 8) {
                return 4;
            }
            else if (rawScore >= 9 && rawScore <= 10) {
                return 5;
            }
            else if (rawScore >= 11 && rawScore <= 12) {
                return 6;
            }
            else if (rawScore === 13) {
                return 7;
            }
            else if (rawScore === 14) {
                return 8;
            }
            else if (rawScore === 15) {
                return 9;
            }
            break;
        case 'C':
            if (rawScore >= 0 && rawScore <= 2) {
                return 1;
            }
            else if (rawScore >= 3 && rawScore <= 5) {
                return 2;
            }
            else if (rawScore >= 6 && rawScore <= 8) {
                return 3;
            }
            else if (rawScore >= 9 && rawScore <= 12) {
                return 4;
            }
            else if (rawScore >= 13 && rawScore <= 16) {
                return 5;
            }
            else if (rawScore >= 17 && rawScore <= 18) {
                return 6;
            }
            else if (rawScore === 19) {
                return 7;
            }
            else if (rawScore === 20) {
                return 8;
            }
            break;
        case 'E':
            if (rawScore >= 0 && rawScore <= 2) {
                return 1;
            }
            else if (rawScore >= 3 && rawScore <= 5) {
                return 2;
            }
            else if (rawScore >= 6 && rawScore <= 8) {
                return 3;
            }
            else if (rawScore >= 9 && rawScore <= 11) {
                return 4;
            }
            else if (rawScore >= 12 && rawScore <= 14) {
                return 5;
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 6;
            }
            else if (rawScore === 18) {
                return 7;
            }
            else if (rawScore === 19) {
                return 8;
            }
            else if (rawScore === 20) {
                return 9;
            }
            break;
        case 'F':
            if (rawScore >= 0 && rawScore <= 3) {
                return 2;
            }
            else if (rawScore >= 4 && rawScore <= 6) {
                return 3;
            }
            else if (rawScore >= 7 && rawScore <= 9) {
                return 4;
            }
            else if (rawScore >= 10 && rawScore <= 12) {
                return 5;
            }
            else if (rawScore >= 13 && rawScore <= 15) {
                return 6;
            }
            else if (rawScore >= 16 && rawScore <= 17) {
                return 7;
            }
            else if (rawScore === 18) {
                return 8;
            }
            else if (rawScore >= 19 && rawScore <= 20) {
                return 9;
            }
            break;
        case 'G':
            if (rawScore >= 0 && rawScore <= 2) {
                return 1;
            }
            else if (rawScore >= 3 && rawScore <= 5) {
                return 2;
            }
            else if (rawScore >= 6 && rawScore <= 8) {
                return 3;
            }
            else if (rawScore >= 9 && rawScore <= 11) {
                return 4;
            }
            else if (rawScore >= 12 && rawScore <= 15) {
                return 5;
            }
            else if (rawScore >= 16 && rawScore <= 18) {
                return 6;
            }
            else if (rawScore >= 19 && rawScore <= 20) {
                return 7;
            }
            else if (rawScore === 21) {
                return 8;
            }
            else if (rawScore === 22) {
                return 9;
            }
            break;
        case 'H':
            if (rawScore >= 0 && rawScore <= 1) {
                return 2;
            }
            else if (rawScore >= 2 && rawScore <= 3) {
                return 3;
            }
            else if (rawScore >= 4 && rawScore <= 7) {
                return 4;
            }
            else if (rawScore >= 8 && rawScore <= 12) {
                return 5;
            }
            else if (rawScore >= 13 && rawScore <= 16) {
                return 6;
            }
            else if (rawScore >= 17 && rawScore <= 18) {
                return 7;
            }
            else if (rawScore === 19) {
                return 8;
            }
            else if (rawScore === 20) {
                return 9;
            }
            break;
        case 'I':
            if (rawScore === 0) {
                return 1;
            }
            else if (rawScore >= 1 && rawScore <= 2) {
                return 2;
            }
            else if (rawScore >= 3 && rawScore <= 5) {
                return 3;
            }
            else if (rawScore >= 6 && rawScore <= 8) {
                return 4;
            }
            else if (rawScore >= 9 && rawScore <= 12) {
                return 5;
            }
            else if (rawScore >= 13 && rawScore <= 16) {
                return 6;
            }
            else if (rawScore >= 17 && rawScore <= 19) {
                return 7;
            }
            else if (rawScore >= 20 && rawScore <= 21) {
                return 8;
            }
            else if (rawScore === 22) {
                return 9;
            }
            break;
        case 'L':
            if (rawScore >= 0 && rawScore <= 1) {
                return 1;
            }
            else if (rawScore >= 2 && rawScore <= 3) {
                return 2;
            }
            else if (rawScore >= 4 && rawScore <= 5) {
                return 3;
            }
            else if (rawScore >= 6 && rawScore <= 7) {
                return 4;
            }
            else if (rawScore >= 8 && rawScore <= 10) {
                return 5;
            }
            else if (rawScore >= 11 && rawScore <= 13) {
                return 6;
            }
            else if (rawScore >= 14 && rawScore <= 15) {
                return 7;
            }
            else if (rawScore >= 16 && rawScore <= 17) {
                return 8;
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 9;
            }
            else if (rawScore === 20) {
                return 10;
            }
            break;
        case 'M':
            if (rawScore === 0) {
                return 2;
            }
            else if (rawScore === 1) {
                return 3;
            }
            else if (rawScore >= 2 && rawScore <= 3) {
                return 4;
            }
            else if (rawScore >= 4 && rawScore <= 6) {
                return 5;
            }
            else if (rawScore >= 7 && rawScore <= 10) {
                return 6;
            }
            else if (rawScore >= 11 && rawScore <= 14) {
                return 7;
            }
            else if (rawScore >= 15 && rawScore <= 18) {
                return 8;
            }
            else if (rawScore >= 19 && rawScore <= 20) {
                return 9;
            }
            else if (rawScore >= 21 && rawScore <= 22) {
                return 10;
            }
            break;
        case 'N':
            if (rawScore === 0) {
                return 1;
            }
            else if (rawScore >= 1 && rawScore <= 2) {
                return 2;
            }
            else if (rawScore >= 3 && rawScore <= 4) {
                return 3;
            }
            else if (rawScore >= 5 && rawScore <= 7) {
                return 4;
            }
            else if (rawScore >= 8 && rawScore <= 10) {
                return 5;
            }
            else if (rawScore >= 11 && rawScore <= 14) {
                return 6;
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 7;
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 8;
            }
            else if (rawScore === 20) {
                return 9;
            }
            break;
        case 'O':
            if (rawScore >= 0 && rawScore <= 1) {
                return 2;
            }
            else if (rawScore >= 2 && rawScore <= 3) {
                return 3;
            }
            else if (rawScore >= 4 && rawScore <= 6) {
                return 4;
            }
            else if (rawScore >= 7 && rawScore <= 10) {
                return 5;
            }
            else if (rawScore >= 11 && rawScore <= 14) {
                return 6;
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 7;
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 8;
            }
            else if (rawScore === 20) {
                return 9;
            }
            break;
        case 'Q1':
            if (rawScore >= 0 && rawScore <= 4) {
                return 1;
            }
            else if (rawScore >= 5 && rawScore <= 7) {
                return 2;
            }
            else if (rawScore >= 8 && rawScore <= 9) {
                return 3;
            }
            else if (rawScore >= 10 && rawScore <= 13) {
                return 4;
            }
            else if (rawScore >= 14 && rawScore <= 17) {
                return 5;
            }
            else if (rawScore >= 18 && rawScore <= 20) {
                return 6;
            }
            else if (rawScore >= 21 && rawScore <= 23) {
                return 7;
            }
            else if (rawScore >= 24 && rawScore <= 25) {
                return 8;
            }
            else if (rawScore >= 26 && rawScore <= 27) {
                return 9;
            }
            else if (rawScore === 28) {
                return 10;
            }
            break;
        case 'Q2':
            if (rawScore === 0) {
                return 2;
            }
            else if (rawScore === 1) {
                return 3;
            }
            else if (rawScore >= 2 && rawScore <= 3) {
                return 4;
            }
            else if (rawScore >= 4 && rawScore <= 6) {
                return 5;
            }
            else if (rawScore >= 7 && rawScore <= 10) {
                return 6;
            }
            else if (rawScore >= 11 && rawScore <= 14) {
                return 7;
            }
            else if (rawScore >= 15 && rawScore <= 16) {
                return 8;
            }
            else if (rawScore >= 17 && rawScore <= 18) {
                return 9;
            }
            else if (rawScore >= 19 && rawScore <= 20) {
                return 10;
            }
            break;
        case 'Q3':
            if (rawScore >= 0 && rawScore <= 1) {
                return 1;
            }
            else if (rawScore >= 2 && rawScore <= 3) {
                return 2;
            }
            else if (rawScore >= 4 && rawScore <= 5) {
                return 3;
            }
            else if (rawScore >= 6 && rawScore <= 8) {
                return 4;
            }
            else if (rawScore >= 9 && rawScore <= 12) {
                return 5;
            }
            else if (rawScore >= 13 && rawScore <= 15) {
                return 6;
            }
            else if (rawScore >= 16 && rawScore <= 17) {
                return 7;
            }
            else if (rawScore === 18) {
                return 8;
            }
            else if (rawScore >= 19 && rawScore <= 20) {
                return 9;
            }
            break;
        case 'Q4':
            if (rawScore >= 0 && rawScore <= 1) {
                return 2;
            }
            else if (rawScore >= 2 && rawScore <= 3) {
                return 3;
            }
            else if (rawScore >= 4 && rawScore <= 6) {
                return 4;
            }
            else if (rawScore >= 7 && rawScore <= 10) {
                return 5;
            }
            else if (rawScore >= 11 && rawScore <= 14) {
                return 6;
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 7;
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 8;
            }
            else if (rawScore === 20) {
                return 9;
            }
            break;
    }
    // Default to 1 if no custom logic applies
    return 1;
};
// Controller to handle creating a new OMR result
const createOmrResult = async (req, res) => {
    const { userID, firstName, lastName, age, sex, course, year, section, scoring, testType, testDate, uploadURL } = req.body;
    try {
        // Validate required fields
        if (!userID || !firstName || !lastName || !age || !sex || !course || !year || !section || !testType || !testDate || !uploadURL) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const testID = `${userID}-${Date.now()}`;
        // Initialize scoring object
        const scoringArray = scoring.map((entry) => {
            const stenScore = calculateStenScore(entry.rawScore, entry.factorLetter); // Assuming calculateStenScore is a function to calculate stenScore
            return {
                factorLetter: entry.factorLetter,
                rawScore: entry.rawScore,
                stenScore, // Push calculated stenScore
            };
        });
        // Create and save the test document
        const testDocument = new omrPFSchema_1.default({
            userID,
            firstName,
            lastName,
            age,
            sex,
            course,
            year,
            section,
            testID,
            scoring: { scores: scoringArray }, // Use the transformed scoring data
            testType,
            testDate,
            uploadURL
        });
        await testDocument.save();
        res.status(201).json({ message: 'OMR result saved successfully', data: testDocument });
    }
    catch (error) {
        console.error('Error creating OMR result:', error);
        res.status(500).json({
            message: 'Error saving OMR result',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.createOmrResult = createOmrResult;
// Controller to retrieve all IQ test results for a user
const getIQTestResultsByAll = async (req, res) => {
    try {
        const allUserIQTests = await omrPFSchema_1.default.find();
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
        const testResult = await omrPFSchema_1.default.find({ userID });
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
        const testResult = await omrPFSchema_1.default.find({ testID });
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
        const testResult = await omrPFSchema_1.default.findById(id);
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
        const updatedIQTestResult = await omrPFSchema_1.default.findOneAndUpdate({ testID }, // Find the document with the matching testID
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
        const deletedIQTestResult = await omrPFSchema_1.default.findOneAndDelete({ testID: id });
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
// Archive Controller to archive an IQ test result
// Controller to archive an IQ test result
const archivePFTestResult = async (req, res) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await omrPFSchema_1.default.findOne({ testID: testID });
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
exports.archivePFTestResult = archivePFTestResult;
// Controller for fetching archived IQ test results
const getArchivedPFTests = async (req, res) => {
    try {
        const archivedTests = await omrPFSchema_1.default.find({ isArchived: true });
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
exports.getArchivedPFTests = getArchivedPFTests;
const deleteArchivedPFTestResult = async (req, res) => {
    const { testID } = req.params;
    try {
        const consultationRequest = await omrPFSchema_1.default.findOne({ testID });
        if (!consultationRequest) {
            return res.status(404).json({ message: 'Consultation request not found' });
        }
        // Delete the consultation request
        await omrPFSchema_1.default.deleteOne({ testID });
        res.status(200).json({ message: 'Consultation request deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting consultation request',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.deleteArchivedPFTestResult = deleteArchivedPFTestResult;
