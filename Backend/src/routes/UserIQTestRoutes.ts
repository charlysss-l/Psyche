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
router.get('/tests/user/:userID', getIQTestResultsByUser);

// Route to retrieve a specific IQ test result by test ID
router.get('/tests/:testID', getIQTestResultById);

// Route to update an IQ test result by test ID
router.put('/tests/:testID', updateIQTestResult);

// Route to delete an IQ test result by test ID
router.delete('/tests/:testID', deleteIQTestResult);

export default router;
