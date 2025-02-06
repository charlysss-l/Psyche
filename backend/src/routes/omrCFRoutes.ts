import { Router, Request, Response } from 'express';  // Make sure to import Request and Response
import {
    createOmrCFResult,
    getOmrCFResultsByUser,
    getOmrCFResultById,
    updateOmrCFResult,
    deleteOmrCFResult,
    getCFTestResultsByAll,
    getOmrCFResultsByTestID,

    // Archived routes
    archiveCFTestResult,
    getArchivedCFTests,
    deleteArchivedCFTestResult
} from '../controllers/omrCFController'; // Ensure this path is correct

const router = Router();

// Route to create a new CF test result
router.post('/', createOmrCFResult);

router.get('/', getCFTestResultsByAll);


// Route to retrieve all CF test results for a specific user
router.get('/test/:userID', getOmrCFResultsByUser);

// Route to retrieve a specific CF test result by test ID
router.get('/:id', getOmrCFResultById);

router.get('/test/physical/:testID', getOmrCFResultsByTestID);

// Route to update an CF test result by test ID
router.put('/test/:testID', updateOmrCFResult);

// Route to delete an CF test result by test ID
router.delete('/test/:id', deleteOmrCFResult);



// Route to archive an CF test result 
router.put('/archive/:testID', async (req: Request, res: Response) => {
    try {
      await archiveCFTestResult(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });

// Route to get archived CF test results
router.get('/isTrue/archived/all', async (req: Request, res: Response) => {
    try {
        await getArchivedCFTests(req, res);  // Fetch the archived CF test results
    } catch (error) {
        res.status(500).json({ message: 'Error fetching archived CF test results', error });
    }
});


router.delete('/test/delete/:testID', async (req: Request, res: Response) => {
    try {
      await deleteArchivedCFTestResult(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });



export default router;