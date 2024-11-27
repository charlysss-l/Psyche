import { Request, Response } from 'express';
import { ConsultationRequest } from '../models/consultationschema';
import { param } from 'express-validator';

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

export const getConsultationRequestsByUserID = async (req: Request, res: Response) => {
  const { userId } = req.params;

    try {
        const ConsultationRequestUserID = await ConsultationRequest.find({ userId });
        if (ConsultationRequestUserID.length === 0) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: ConsultationRequestUserID });
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
    const request = await ConsultationRequest.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: 'Error' });
  }
};

// Admin route to mark consultation request as "removed" using the id
export const deleteConsultationRequestById = async (req: Request, res: Response) => {
  try {
    const request = await ConsultationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    // Mark the request as "removed"
    request.status = 'removed';
    const updatedRequest = await request.save();

    res.status(200).json(updatedRequest);  // Return the updated request
  } catch (error) {
    res.status(400).json({ message: 'Error updating consultation request', error });
  }
};




// Admin route to delete the consultation request using the testID
export const deleteConsultationRequest = async (req: Request, res: Response) => {
  const { testID } = req.params;
  try {
    const consultationRequest = await ConsultationRequest.findOne({ testID });
    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    // Delete the consultation request
    await ConsultationRequest.deleteOne({ testID });

    res.status(200).json({ message: 'Consultation request deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting consultation request',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};



export const cancelConsultationRequest = async (req: Request, res: Response) => {
  const { testID } = req.params;
  try {
    const CancelConsultationRequestTestID = await ConsultationRequest.findOne({ testID });
    if (!CancelConsultationRequestTestID) {
        res.status(404).json({ message: 'Test result not found' });
        return;
    }

     // Update the status to "cancelled"
     CancelConsultationRequestTestID.status = 'cancelled';
     await CancelConsultationRequestTestID.save(); // Save the updated document

    res.status(200).json({ data: CancelConsultationRequestTestID });
} catch (error) {
    res.status(500).json({
        message: 'Error retrieving IQ test result',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
}
};
