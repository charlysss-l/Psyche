import { Router } from 'express';
import {
    createUser16PFTest,
    getUser16PFTests,
    getUser16PFTestById,
    updateUser16PFTest,
    deleteUser16PFTest
} from '../controllers/user16PFTestController';

const router = Router();

router.post('/', createUser16PFTest);
router.get('/', getUser16PFTests);
router.get('/:id', getUser16PFTestById);
router.put('/:id', updateUser16PFTest);
router.delete('/:id', deleteUser16PFTest); 
export default router;
