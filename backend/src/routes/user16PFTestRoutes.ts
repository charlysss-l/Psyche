import {Router} from 'express';
import{
    createUser16PFTest
} from '../controllers/user16PFTestController';

const router = Router();

router.post('/', createUser16PFTest);

export default router;
