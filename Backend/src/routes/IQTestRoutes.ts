import { Router } from 'express';
import {
    createIQTest,
    getAllIQTests,
    getIQTestById,
    updateIQTestById,
    deleteIQTestById,
    updateQuestionById,
    updateInterpretationBySpecificId
} from '../controllers/IQTestController';

const router = Router();

router.post('/', createIQTest);           // Create a new IQ Test
router.get('/', getAllIQTests);          // Get all IQ Tests
router.get('/:id', getIQTestById);       // Get a specific IQ Test by ID
router.put('/:id', updateIQTestById);    // Update a specific IQ Test by ID
router.put('/:id/question/:questionID', updateQuestionById);
router.put('/api/IQtest/:id/interpretation/:interpretationId', updateInterpretationBySpecificId);
router.delete('/:id', deleteIQTestById); // Delete a specific IQ Test by ID



export default router;