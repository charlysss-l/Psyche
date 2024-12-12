"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const user16PFTestRoutes_1 = __importDefault(require("./routes/user16PFTestRoutes"));
const UserIQTestRoutes_1 = __importDefault(require("./routes/UserIQTestRoutes"));
const Test16PFRoutes_1 = __importDefault(require("./routes/Test16PFRoutes"));
const IQTestRoutes_1 = __importDefault(require("./routes/IQTestRoutes"));
const uploadController_1 = __importDefault(require("./controllers/uploadController"));
const consultationroutes_1 = __importDefault(require("./routes/consultationroutes"));
const followUpRoutes_1 = __importDefault(require("./routes/followUpRoutes"));
const authPsychRoutes_1 = __importDefault(require("./authRoutes/authPsychRoutes"));
const authGuidanceRoutes_1 = __importDefault(require("./authRoutes/authGuidanceRoutes"));
const authStudentsRoutes_1 = __importDefault(require("./authRoutes/authStudentsRoutes"));
const userRoutes_1 = __importDefault(require("./authRoutes/userRoutes"));
const surveyRoutes_1 = __importDefault(require("./routes/surveyRoutes"));
const surveyResponseRoutes_1 = __importDefault(require("./routes/surveyResponseRoutes"));
const IQTestController_1 = require("./controllers/IQTestController");
const omrIQRoutes_1 = __importDefault(require("./routes/omrIQRoutes"));
const omrPFRoutes_1 = __importDefault(require("./routes/omrPFRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to the database
(0, db_1.default)();
// Middleware configuration
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Use routes
app.use('/api/user16pf', user16PFTestRoutes_1.default);
app.use('/api/useriq', UserIQTestRoutes_1.default);
app.use('/api/16pf', Test16PFRoutes_1.default);
app.use('/api/IQtest', IQTestRoutes_1.default);
app.use('/api', uploadController_1.default);
app.use('/api/consult', consultationroutes_1.default);
app.use('/api/followup', followUpRoutes_1.default);
app.put('/api/IQtest/:id/interpretation/:interpretationId', IQTestController_1.updateInterpretationBySpecificId);
app.use('/api/omr', omrIQRoutes_1.default); // iq
app.use('/api/omr16pf', omrPFRoutes_1.default); //pf
// Survey routes
app.use('/api', surveyRoutes_1.default);
app.use('/api/response', surveyResponseRoutes_1.default);
app.use('/api', surveyResponseRoutes_1.default);
// Authentication routes
app.use('/api/auth', authPsychRoutes_1.default);
app.use('/api/authGuidance', authGuidanceRoutes_1.default);
app.use('/api/authStudents', authStudentsRoutes_1.default);
app.use('/api/allusers', userRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
