"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const IQTestController_1 = require("../controllers/IQTestController");
const router = (0, express_1.Router)();
router.post('/', IQTestController_1.createIQTest); // Create a new IQ Test
router.get('/', IQTestController_1.getAllIQTests); // Get all IQ Tests
router.get('/:id', IQTestController_1.getIQTestById); // Get a specific IQ Test by ID
router.put('/:id', IQTestController_1.updateIQTestById); // Update a specific IQ Test by ID
router.delete('/:id', IQTestController_1.deleteIQTestById); // Delete a specific IQ Test by ID
exports.default = router;
