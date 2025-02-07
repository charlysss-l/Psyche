import { Router, Request, Response } from 'express';  // Make sure to import Request and Response
import {
    createIQTestResult,
    getIQTestResultsByAll,
    getIQTestResultsByUserID,
    getIQTestResultById,
    updateIQTestResult,
    deleteIQTestResult,
    getIQTestResultsByTestID,

    // Archived routes
    archiveIQTestResult,
    getArchivedIQTests,
    deleteArchivedIQTestResult,
    
    unarchiveIQTestResult
} from '../controllers/UserIQTestController'; // Ensure this path is correct

const router = Router();

// Route to create a new IQ test result
router.post('/', async (req: Request, res: Response) => {
  try {
    await createIQTestResult(req, res);  // Use the testID for deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation by testID', error });
  }
});

// Route to retrieve all IQ test results for a specific user
router.get('/:userID', getIQTestResultsByUserID);
router.get('/', getIQTestResultsByAll);

router.get('/test/:testID', getIQTestResultsByTestID);


// Route to retrieve a specific IQ test result by test ID
router.get('/:id', getIQTestResultById);

// Route to update an IQ test result by test ID
router.put('/:id', updateIQTestResult);

// Route to delete an IQ test result by test ID
router.delete('/test/:id', deleteIQTestResult);



// Route to archive an IQ test result 
router.put('/archive/:testID', async (req: Request, res: Response) => {
    try {
      await archiveIQTestResult(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });

// Route to get archived IQ test results
router.get('/isTrue/archived/all', async (req: Request, res: Response) => {
    try {
        await getArchivedIQTests(req, res);  // Fetch the archived IQ test results
    } catch (error) {
        res.status(500).json({ message: 'Error fetching archived IQ test results', error });
    }
});


router.delete('/test/delete/:testID', async (req: Request, res: Response) => {
    try {
      await deleteArchivedIQTestResult(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });


router.put('/unarchive/:testID', async (req: Request, res: Response) => {
    try {
      await unarchiveIQTestResult(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });

export default router;
