import express, { Request, Response } from 'express';
import { createConsultationRequest, getConsultationRequestsById, restoreConsultationRequest, getArchivedConsultations, getArchivedConsultationsByUserID, markConsultationRequestAsDone, archiveConsultationRequest, acceptConsultationRequest, deleteConsultationRequest, getConsultationRequests, getConsultationRequestsByUserID, cancelConsultationRequest, declineConsultationRequest, deleteConsultationRequestById  } from '../controllers/consultationcontroller';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
      await createConsultationRequest(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error creating survey', error });
    }
  });
router.get('/', getConsultationRequests);
router.get('/user/:userId', getConsultationRequestsByUserID);
router.get('/:testID', getConsultationRequestsById);
router.get('/archive/status/archived', async (req: Request, res: Response) => {
  try {
    await getArchivedConsultations(req, res);  // Use the id to mark as removed
  } catch (error) {
    res.status(500).json({ message: 'Error removing consultation by id', error });
  }
});router.get('/archive/userId/:userId', getArchivedConsultationsByUserID);
router.put('/:id/accept', acceptConsultationRequest);
// Mark consultation request as "removed" by id (admin)
router.delete('/id/:id/delete', async (req: Request, res: Response) => {
  try {
    await deleteConsultationRequestById(req, res);  // Use the id to mark as removed
  } catch (error) {
    res.status(500).json({ message: 'Error removing consultation by id', error });
  }
});

// Delete consultation request by testID (admin)
router.delete('/test/:testID/delete', async (req: Request, res: Response) => {
  try {
    await deleteConsultationRequest(req, res);  // Use the testID for deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation by testID', error });
  }
});
router.put('/:testID/cancel', cancelConsultationRequest);
router.put('/archive/:testID', archiveConsultationRequest);
router.put('/:id/mark-done', async (req: Request, res: Response) => {
  try {
    await markConsultationRequestAsDone(req, res);  // Use the testID for deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation by testID', error });
  }
});

router.put('/:id/decline', async (req: Request, res: Response) => {
  try {
    await declineConsultationRequest(req, res);  // Use the testID for deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation by testID', error });
  }
});

router.put('/restore/:testID', restoreConsultationRequest);
export default router;
