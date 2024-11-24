import express, { Request, Response } from 'express';
import {
    createUser16PFTest,
    getUser16PFTests,
    getUser16PFTestByUserId,
    getUser16PFTestById,
    updateUser16PFTest,
    deleteUser16PFTest,
    getUser16PFTestByTestID,
    
} from '../controllers/user16PFTestController';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
      await createUser16PFTest(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error creating survey', error });
    }
  });
router.get('/user/:userID', async (req: Request, res: Response) => {
    try {
      await getUser16PFTestByUserId(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error getting test', error });
    }
  });

router.get('/test/:testID', async (req: Request, res: Response) => {
    try {
      await getUser16PFTestByTestID(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error getting test', error });
    }
  });
router.get('/', getUser16PFTests);
router.get('/:id', getUser16PFTestById);
router.put('/:id', updateUser16PFTest);
router.delete('/:id', deleteUser16PFTest); 

export default router;
