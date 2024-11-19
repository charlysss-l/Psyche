import { Router, Request, Response } from 'express';  // Make sure to import Request and Response
import {
    createIQTestResult,
    getIQTestResultsByAll,
    getIQTestResultsByUserID,
    getIQTestResultById,
    updateIQTestResult,
    deleteIQTestResult
} from '../controllers/UserIQTestController'; // Ensure this path is correct

const router = Router();

// Route to create a new IQ test result
router.post('/', createIQTestResult);

// Route to retrieve all IQ test results for a specific user
router.get('/:userID', getIQTestResultsByUserID);
router.get('/', getIQTestResultsByAll);


// Route to retrieve a specific IQ test result by test ID
router.get('/:id', getIQTestResultById);

// Route to update an IQ test result by test ID
router.put('/:id', updateIQTestResult);

// Route to delete an IQ test result by test ID
router.delete('/:id', deleteIQTestResult);

export default router;
