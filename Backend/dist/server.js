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
const IQTestRoutes_1 = __importDefault(require("./routes/IQTestRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Use routes
app.use('/api/user16pf', user16PFTestRoutes_1.default); // 16PF test routes
app.use('/api/useriq', UserIQTestRoutes_1.default);
app.use('/api/iqtest', IQTestRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
