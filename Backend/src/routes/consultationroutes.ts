import express from 'express';
import { createConsultationRequest, getConsultationRequests, acceptConsultationRequest, declineConsultationRequest } from '../controllers/consultationcontroller';

const router = express.Router();

router.post('/', createConsultationRequest);
router.get('/', getConsultationRequests);
router.put('/:id/accept', acceptConsultationRequest);
router.delete('/:id/decline', declineConsultationRequest);

export default router;
