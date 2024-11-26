import express, { Request, Response } from 'express';
import { createConsultationRequest, getConsultationRequestsById, acceptConsultationRequest, declineConsultationRequest, getConsultationRequests  } from '../controllers/consultationcontroller';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
      await createConsultationRequest(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error creating survey', error });
    }
  });
router.get('/', getConsultationRequests);
router.get('/:testID', getConsultationRequestsById);
router.put('/:id/accept', acceptConsultationRequest);
router.delete('/:id/decline', declineConsultationRequest);

export default router;
