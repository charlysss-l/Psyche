"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser16PFTest = exports.updateUser16PFTest = exports.getUser16PFTestById = exports.getUser16PFTests = exports.createUser16PFTest = void 0;
const User16PFTestSchema_1 = __importDefault(require("../models/User16PFTestSchema"));
const createUser16PFTest = async (req, res) => {
    const { userID, firstName, lastName, age, sex, courseSection, responses, testType } = req.body;
    try {
        // Validate that required fields are present
        if (!userID || !firstName || !lastName || !age || !sex || !courseSection || !responses || !testType) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        // Check that responses array is not empty and contains the required structure
        if (!Array.isArray(responses) || responses.length === 0) {
            res.status(400).json({ message: 'Responses must be a non-empty array' });
            return;
        }
        // Map responses ensuring they contain the necessary fields
        const mappedResponses = responses.map((response) => {
            if (!response.factorLetter) {
                throw new Error('factorLetter is required in each response');
            }
            return {
                questionID: response.questionID,
                selectedChoice: response.selectedChoice,
                equivalentScore: response.equivalentScore,
                factorLetter: response.factorLetter,
            };
        });
        // Initialize scoring object
        const scoring = {
            scores: [] // Start with an empty array for scores
        };
        // Create scoring based on factorLetter
        const factorLetters = [...new Set(mappedResponses.map(response => response.factorLetter))];
        factorLetters.forEach(factorLetter => {
            const totalScore = mappedResponses
                .filter(response => response.factorLetter === factorLetter)
                .reduce((sum, response) => sum + response.equivalentScore, 0);
            scoring.scores.push({
                factorLetter,
                rawScore: totalScore,
                stenScore: 1 // Default value for stenScore
            });
        });
        // Create the test document
        const testDocument = new User16PFTestSchema_1.default({
            userID,
            firstName,
            lastName,
            age,
            sex,
            courseSection,
            responses: mappedResponses,
            scoring, // Use the newly constructed scoring object
            testType,
        });
        await testDocument.save();
        res.status(201).json({ message: 'Test created successfully!', data: testDocument });
    }
    catch (error) {
        console.log('Request body:', req.body);
        console.error('Error creating test:', error);
        res.status(500).json({
            message: 'Error creating test',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            stack: error instanceof Error ? error.stack : undefined // Optional: Include stack trace for debugging
        });
    }
};
exports.createUser16PFTest = createUser16PFTest;
const getUser16PFTests = async (req, res) => {
    try {
        const allUser16PFtests = await User16PFTestSchema_1.default.find();
        res.status(200).json({ data: allUser16PFtests });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching tests', error: errorMessage });
    }
};
exports.getUser16PFTests = getUser16PFTests;
const getUser16PFTestById = async (req, res) => {
    const { id } = req.params;
    try {
        const PFuserTest = await User16PFTestSchema_1.default.findById(id);
        if (!PFuserTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ data: PFuserTest });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching user test',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.getUser16PFTestById = getUser16PFTestById;
const updateUser16PFTest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUserPFTest = await User16PFTestSchema_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUserPFTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: 'Test updated successfully', data: updatedUserPFTest });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating user test',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.updateUser16PFTest = updateUser16PFTest;
const deleteUser16PFTest = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUserPFTest = await User16PFTestSchema_1.default.findByIdAndDelete(id);
        if (!deletedUserPFTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: 'User 16PF Test deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user test', error: error.message });
    }
};
exports.deleteUser16PFTest = deleteUser16PFTest;
