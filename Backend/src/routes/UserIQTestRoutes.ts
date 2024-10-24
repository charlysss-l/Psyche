import { Router, Request, Response } from 'express';  // Make sure to import Request and Response
import {
    createIQTestResult,
    getIQTestResultsByUser,
    getIQTestResultById,
    updateIQTestResult,
    deleteIQTestResult
} from '../controllers/UserIQTestController'; // Ensure this path is correct

const router = Router();

// Route to create a new IQ test result
router.post('/tests', createIQTestResult);

// Route to retrieve all IQ test results for a specific user
router.get('/tests', getIQTestResultsByUser);

// Route to retrieve a specific IQ test result by test ID
router.get('/tests/:id', getIQTestResultById);

// Route to update an IQ test result by test ID
router.put('/tests/:id', updateIQTestResult);

// Route to delete an IQ test result by test ID
router.delete('/tests/:id', deleteIQTestResult);

export default router;
