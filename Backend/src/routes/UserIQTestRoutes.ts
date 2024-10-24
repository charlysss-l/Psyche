import { Router } from 'express';
import {
    createIQTestResult,
    getIQTestResultsByUser,
    getIQTestResultById,
    updateIQTestResult,
    deleteIQTestResult
} from '../controllers/UserIQTestController';

const router = Router();

// Route to create a new test result
router.post('/tests', createIQTestResult);

// Route to get all tests for a specific user
router.get('/tests/user/:userID', getIQTestResultsByUser);

// Route to get a specific test result by test ID
router.get('/tests/:testID', getIQTestResultById);

// Route to update a specific test result
router.put('/tests/:testID', updateIQTestResult);

// Route to delete a test result
router.delete('/tests/:testID', deleteIQTestResult);

export default router;
