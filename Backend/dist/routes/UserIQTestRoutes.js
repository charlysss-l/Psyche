"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Make sure to import Request and Response
const UserIQTestController_1 = require("../controllers/UserIQTestController"); // Ensure this path is correct
const router = (0, express_1.Router)();
// Route to create a new IQ test result
router.post('/', UserIQTestController_1.createIQTestResult);
// Route to retrieve all IQ test results for a specific user
router.get('/', UserIQTestController_1.getIQTestResultsByUser);
// Route to retrieve a specific IQ test result by test ID
router.get('/:id', UserIQTestController_1.getIQTestResultById);
// Route to update an IQ test result by test ID
router.put('/:id', UserIQTestController_1.updateIQTestResult);
// Route to delete an IQ test result by test ID
router.delete('/:id', UserIQTestController_1.deleteIQTestResult);
exports.default = router;
