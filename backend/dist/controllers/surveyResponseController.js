"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArchivedSurveysByUserId = exports.getAllStudentsSurveyResponses = exports.getStudentResponses = exports.submitSurveyResponses = exports.getAllSurveysForStudents = void 0;
const surveySchema_1 = __importDefault(require("../models/surveySchema"));
const surveyResponseSchema_1 = __importDefault(require("../models/surveyResponseSchema"));
// Controller to fetch all surveys for students
const getAllSurveysForStudents = async (req, res) => {
    try {
        const surveys = await surveySchema_1.default.find(); // Fetch all surveys
        res.status(200).json(surveys);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching surveys' });
    }
};
exports.getAllSurveysForStudents = getAllSurveysForStudents;
const submitSurveyResponses = async (req, res) => {
    try {
        console.log(req.body);
        const { surveyId, responses, userId } = req.body;
        // Validate that each response has a valid questionId and choice
        const formattedResponses = responses.map((response) => {
            if (!response.questionId || !response.choice) {
                throw new Error('Invalid response data');
            }
            return {
                questionId: response.questionId,
                choice: response.choice,
            };
        });
        // Create a new SurveyResponse entry
        const newResponse = new surveyResponseSchema_1.default({
            surveyId,
            userId, // Store the userId along with responses
            responses: formattedResponses,
        });
        // Mark the survey as archived
        await surveySchema_1.default.findByIdAndUpdate(surveyId, { isArchived: true });
        await newResponse.save();
        res.status(201).json({ message: 'Survey responses submitted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting responses' });
    }
};
exports.submitSurveyResponses = submitSurveyResponses;
// Get responses for a specific student (userId)
const getStudentResponses = async (req, res) => {
    const { userId } = req.params; // Changed studentId to userId
    try {
        const responses = await surveyResponseSchema_1.default.find({ userId }); // Changed studentId to userId
        res.status(200).json(responses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching responses' });
    }
};
exports.getStudentResponses = getStudentResponses;
const getAllStudentsSurveyResponses = async (req, res) => {
    const { surveyId } = req.query;
    if (!surveyId) {
        res.status(400).json({ error: 'Survey ID is required' });
        return;
    }
    try {
        const responses = await surveyResponseSchema_1.default.find({ surveyId });
        if (responses.length === 0) {
            res.status(404).json({ error: 'No responses found for this survey' });
            return;
        }
        res.json(responses);
    }
    catch (err) {
        console.error('Error fetching survey responses:', err);
        res.status(500).json({ error: 'Failed to fetch survey responses' });
    }
};
exports.getAllStudentsSurveyResponses = getAllStudentsSurveyResponses;
const getArchivedSurveysByUserId = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    try {
        // Fetch surveys with the specified userId and isArchived set to true
        const archivedSurveys = await surveyResponseSchema_1.default.find({
            userId: userId, // Match the userId
            isArchived: true, // Ensure isArchived is true
        });
        // Return the archived surveys
        res.status(200).json(archivedSurveys);
    }
    catch (error) {
        console.error("Error fetching archived surveys:", error);
        res.status(500).json({ message: "Error fetching archived surveys" });
    }
};
exports.getArchivedSurveysByUserId = getArchivedSurveysByUserId;
