import express, { Request, Response } from 'express';
import {
    createUser16PFTest,
    getUser16PFTests,
    getUser16PFTestByUserId,
    getUser16PFTestById,
    updateUser16PFTest,
    deleteUser16PFTest,
    getUser16PFTestByTestID,

    // Route to archive an PF test result
    archivePFTestResult,
    getArchivedPFTests,
    deleteArchivedPFTestResult
    
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
router.delete('/test/:id', deleteUser16PFTest); 


// Route to archive an IQ test result 
router.put('/archive/:testID', async (req: Request, res: Response) => {
  try {
    await archivePFTestResult(req, res);  // Use the testID for deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation by testID', error });
  }
});

// Route to get archived IQ test results
router.get('/isTrue/archived/all', async (req: Request, res: Response) => {
  try {
      await getArchivedPFTests(req, res);  // Fetch the archived IQ test results
  } catch (error) {
      res.status(500).json({ message: 'Error fetching archived IQ test results', error });
  }
});


router.delete('/test/delete/:testID', async (req: Request, res: Response) => {
  try {
    await deleteArchivedPFTestResult(req, res);  // Use the testID for deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation by testID', error });
  }
});

export default router;
