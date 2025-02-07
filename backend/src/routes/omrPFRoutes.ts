import { Router, Request, Response } from 'express';  // Make sure to import Request and Response
import {
    createOmrResult,
    getOmrResultsByUser,
    getOmrResultById,
    updateOmrResult,
    deleteOmrResult,
    getIQTestResultsByAll,
    getOmrResultsByTestID,

    // Archived routes
    archivePFTestResult,
    unarchivePFTestResult,
    getArchivedPFTests,
    deleteArchivedPFTestResult
} from '../controllers/omrPFController'; // Ensure this path is correct

const router = Router();

// Route to create a new IQ test result
router.post('/', createOmrResult);

router.get('/', getIQTestResultsByAll);


// Route to retrieve all IQ test results for a specific user
router.get('/:userID', getOmrResultsByUser);

// Route to retrieve a specific IQ test result by test ID
router.get('/:id', getOmrResultById);

router.get('/test/:testID', getOmrResultsByTestID);

// Route to update an IQ test result by test ID
router.put('/test/:testID', updateOmrResult);

// Route to delete an IQ test result by test ID
router.delete('/test/:id', deleteOmrResult);


// Route to archive an IQ test result 
router.put('/archive/:testID', async (req: Request, res: Response) => {
    try {
      await archivePFTestResult(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });

      router.put('/unarchive/:testID', async (req: Request, res: Response) => {
        try {
          await unarchivePFTestResult(req, res);  // Use the testID for deletion
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