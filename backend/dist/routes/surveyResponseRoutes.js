"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/surveyResponseRoutes.ts
const express_1 = __importDefault(require("express"));
const surveyResponseController_1 = require("../controllers/surveyResponseController");
const router = express_1.default.Router();
// Route to get all surveys for students
router.get('/surveys', surveyResponseController_1.getAllSurveysForStudents);
// Route to submit survey responses
router.post('/surveys/submit', surveyResponseController_1.submitSurveyResponses);
// Route to get responses for a specific student
router.get('/responses/student/:userId', surveyResponseController_1.getStudentResponses);
// Endpoint to fetch all survey responses
router.get('/survey-responses', surveyResponseController_1.getAllStudentsSurveyResponses);
// Endpoint to fetch archived survey responses
router.get('/archived-surveys/:userId', surveyResponseController_1.getArchivedSurveysByUserId);
exports.default = router;
