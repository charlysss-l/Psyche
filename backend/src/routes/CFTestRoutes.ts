import { Router } from 'express';
import {
    createCFTest,
    getAllCFTests,
    getCFTestById,
    updateCFTestById,
    deleteCFTestById,
    updateQuestionById,
    updateInterpretationBySpecificId
} from '../controllers/CFTestController';

const router = Router();

router.post('/', createCFTest);           // Create a new CF Test
router.get('/', getAllCFTests);          // Get all CF Tests
router.get('/:id', getCFTestById);       // Get a specific CF Test by ID
router.put('/:id', updateCFTestById);    // Update a specific CF Test by ID
router.put('/:id/question/:questionID', updateQuestionById);
router.put('/api/CFtest/:id/interpretation/:interpretationId', updateInterpretationBySpecificId);
router.delete('/:id', deleteCFTestById); // Delete a specific CF Test by ID



export default router;