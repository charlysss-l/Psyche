import express, { Request, Response } from 'express';
import {
    create16PFTest,
    getAll16PFTests,
    get16PFTestByID,
    update16PFTest,
    delete16PFTest,
    update16PFTestQuestion
} from '../controllers/Test16PFController';

const router = express.Router();

router.post('/', create16PFTest);
router.get('/', getAll16PFTests);
router.get('/:id', get16PFTestByID);
router.put('/:id', update16PFTest);
router.put('/:id/question/:questionID', async (req: Request, res: Response) => {
    try {
      await update16PFTestQuestion(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error updating question', error });
    }
  });
router.delete('/:id', delete16PFTest);

export default router;
