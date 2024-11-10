"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete16PFTest = exports.update16PFTest = exports.get16PFTestByID = exports.getAll16PFTests = exports.create16PFTest = void 0;
const Test16PFModel_1 = __importDefault(require("../models/Test16PFModel"));
const create16PFTest = async (req, res) => {
    try {
        const test = new Test16PFModel_1.default(req.body);
        await test.save();
        res.status(201).json(test);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating test', error: error.message });
    }
};
exports.create16PFTest = create16PFTest;
const getAll16PFTests = async (req, res) => {
    try {
        const tests = await Test16PFModel_1.default.find();
        res.status(200).json(tests);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tests', error: error.message });
    }
};
exports.getAll16PFTests = getAll16PFTests;
const get16PFTestByID = async (req, res) => {
    const { id } = req.params;
    try {
        const test = await Test16PFModel_1.default.findById(id);
        if (!test) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json(test);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching test', error: error.message });
    }
};
exports.get16PFTestByID = get16PFTestByID;
const update16PFTest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTest = await Test16PFModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json(updatedTest);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating test', error: error.message });
    }
};
exports.update16PFTest = update16PFTest;
const delete16PFTest = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTest = await Test16PFModel_1.default.findByIdAndDelete(id);
        if (!deletedTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: '16PF Test deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting test', error: error.message });
    }
};
exports.delete16PFTest = delete16PFTest;
