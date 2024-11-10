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
const authPsychRoutes_1 = __importDefault(require("./authRoutes/authPsychRoutes"));
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
// Authentication routes
app.use('/api/auth', authPsychRoutes_1.default); // Add authentication route
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
