import { Request, Response } from 'express';
import { ConsultationRequest } from '../models/consultationschema';

export const createConsultationRequest = async (req: Request, res: Response) => {
  try {
    const request = new ConsultationRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: 'Error creating Consultation Request', error });
  }
};

export const getConsultationRequestsById = async (req: Request, res: Response) => {
  const { testID } = req.params;

    try {
        const ConsultationRequestTestID = await ConsultationRequest.find({ testID });
        if (ConsultationRequestTestID.length === 0) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: ConsultationRequestTestID });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const getConsultationRequests = async (req: Request, res: Response) => {
  try {
    const requests = await ConsultationRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ message: 'Request Consultation not found' });
  }
};

export const acceptConsultationRequest = async (req: Request, res: Response) => {
  try {
    const request = await ConsultationRequest.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: 'Error' });
  }
};

export const declineConsultationRequest = async (req: Request, res: Response) => {
  try {
    await ConsultationRequest.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Error' });
  }
};
