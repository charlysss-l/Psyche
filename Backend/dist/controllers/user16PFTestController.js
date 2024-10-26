"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser16PFTest = exports.updateUser16PFTest = exports.getUser16PFTestById = exports.getUser16PFTests = exports.createUser16PFTest = void 0;
const User16PFTestSchema_1 = __importDefault(require("../models/User16PFTestSchema"));
const createUser16PFTest = async (req, res) => {
    try {
        const newUser16PFTest = new User16PFTestSchema_1.default(req.body);
        await newUser16PFTest.save();
        res.status(201).json({ message: 'Test created successfully', data: newUser16PFTest });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error creating test', error: errorMessage });
    }
};
exports.createUser16PFTest = createUser16PFTest;
const getUser16PFTests = async (req, res) => {
    try {
        const allUser16PFtests = await User16PFTestSchema_1.default.find();
        res.status(200).json({ data: allUser16PFtests });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching tests', error: errorMessage });
    }
};
exports.getUser16PFTests = getUser16PFTests;
const getUser16PFTestById = async (req, res) => {
    const { id } = req.params;
    try {
        const PFuserTest = await User16PFTestSchema_1.default.findById(id);
        if (!PFuserTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ data: PFuserTest });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching user test', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error fetching user test', error: 'An unknown error occurred' });
        }
    }
};
exports.getUser16PFTestById = getUser16PFTestById;
const updateUser16PFTest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUserPFTest = await User16PFTestSchema_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUserPFTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: 'Test updated successfully', data: updatedUserPFTest });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error updating user test', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error updating user test', error: 'An unknown error occurred' });
        }
    }
};
exports.updateUser16PFTest = updateUser16PFTest;
const deleteUser16PFTest = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUserPFTest = await User16PFTestSchema_1.default.findByIdAndDelete(id);
        if (!deletedUserPFTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: 'User 16PF Test deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user test', error: error.message });
    }
};
exports.deleteUser16PFTest = deleteUser16PFTest;
