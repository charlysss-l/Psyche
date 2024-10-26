import { Router } from 'express';
import {
    create16PFTest,
    getAll16PFTests,
    get16PFTestByID,
    update16PFTest,
    delete16PFTest
} from '../controllers/Test16PFController';

const router = Router();

router.post('/', create16PFTest);
router.get('/', getAll16PFTests);
router.get('/:id', get16PFTestByID);
router.put('/:id', update16PFTest);
router.delete('/:id', delete16PFTest);

export default router;
