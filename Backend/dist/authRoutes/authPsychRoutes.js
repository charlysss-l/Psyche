"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authPsychController_1 = require("../authControllers/authPsychController");
const router = express_1.default.Router();
// POST route for login
router.post('/login', authPsychController_1.login); // Call the login function from the controller
exports.default = router;
