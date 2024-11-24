import { Router, Request, Response } from 'express';  // Make sure to import Request and Response
import {
    createOmrResult,
    getOmrResultsByUser,
    getOmrResultById,
    updateOmrResult,
    deleteOmrResult,
    getIQTestResultsByAll
} from '../controllers/omrPFController'; // Ensure this path is correct

const router = Router();

// Route to create a new IQ test result
router.post('/', createOmrResult);

router.get('/', getIQTestResultsByAll);


// Route to retrieve all IQ test results for a specific user
router.get('/:userID', getOmrResultsByUser);

// Route to retrieve a specific IQ test result by test ID
router.get('/:id', getOmrResultById);

// Route to update an IQ test result by test ID
router.put('/test/:testID', updateOmrResult);

// Route to delete an IQ test result by test ID
router.delete('/:id', deleteOmrResult);



export default router;