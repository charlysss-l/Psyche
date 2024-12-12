"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/surveyRoutes.ts
const express_1 = __importDefault(require("express"));
const surveyController_1 = require("../controllers/surveyController");
const router = express_1.default.Router();
router.post('/surveys/create', async (req, res) => {
    try {
        await (0, surveyController_1.createSurvey)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating survey', error });
    }
});
router.get('/surveys', async (req, res) => {
    try {
        await (0, surveyController_1.getAllSurveys)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching surveys', error });
    }
});
router.delete('/surveys/:id', surveyController_1.deleteSurvey);
router.get("/surveys/:id", surveyController_1.getSurveyById);
exports.default = router;
