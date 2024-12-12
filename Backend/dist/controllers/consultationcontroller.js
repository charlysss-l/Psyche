"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markConsultationRequestAsDone = exports.getArchivedConsultations = exports.getArchivedConsultationsByUserID = exports.archiveConsultationRequest = exports.restoreConsultationRequest = exports.cancelConsultationRequest = exports.deleteConsultationRequest = exports.deleteConsultationRequestById = exports.declineConsultationRequest = exports.acceptConsultationRequest = exports.getConsultationRequests = exports.getConsultationRequestsByUserID = exports.getConsultationRequestsById = exports.createConsultationRequest = void 0;
const consultationschema_1 = require("../models/consultationschema");
const createConsultationRequest = async (req, res) => {
    try {
        const request = new consultationschema_1.ConsultationRequest(req.body);
        await request.save();
        res.status(201).json(request);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating Consultation Request', error });
    }
};
exports.createConsultationRequest = createConsultationRequest;
const getConsultationRequestsById = async (req, res) => {
    const { testID } = req.params;
    try {
        const ConsultationRequestTestID = await consultationschema_1.ConsultationRequest.find({ testID });
        if (ConsultationRequestTestID.length === 0) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: ConsultationRequestTestID });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.getConsultationRequestsById = getConsultationRequestsById;
const getConsultationRequestsByUserID = async (req, res) => {
    const { userId } = req.params;
    try {
        const ConsultationRequestUserID = await consultationschema_1.ConsultationRequest.find({ userId });
        if (ConsultationRequestUserID.length === 0) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        res.status(200).json({ data: ConsultationRequestUserID });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.getConsultationRequestsByUserID = getConsultationRequestsByUserID;
const getConsultationRequests = async (req, res) => {
    try {
        const requests = await consultationschema_1.ConsultationRequest.find();
        res.status(200).json(requests);
    }
    catch (error) {
        res.status(400).json({ message: 'Request Consultation not found' });
    }
};
exports.getConsultationRequests = getConsultationRequests;
const acceptConsultationRequest = async (req, res) => {
    try {
        const request = await consultationschema_1.ConsultationRequest.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
        res.status(200).json(request);
    }
    catch (error) {
        res.status(400).json({ message: 'Error' });
    }
};
exports.acceptConsultationRequest = acceptConsultationRequest;
const declineConsultationRequest = async (req, res) => {
    try {
        // Extract the decline note (message) from the request body
        const { note } = req.body;
        // Update the consultation request with both status and message
        const request = await consultationschema_1.ConsultationRequest.findByIdAndUpdate(req.params.id, {
            status: 'declined',
            message: note // Update the message with the decline reason
        }, { new: true } // This returns the updated document
        );
        // If the request was not found, return an error
        if (!request) {
            return res.status(404).json({ message: 'Consultation request not found' });
        }
        // Return the updated request as the response
        res.status(200).json(request);
    }
    catch (error) {
        // Return an error if something went wrong
        res.status(400).json({ message: 'Error', error: error });
    }
};
exports.declineConsultationRequest = declineConsultationRequest;
// Admin route to mark consultation request as "removed" using the id
const deleteConsultationRequestById = async (req, res) => {
    try {
        const request = await consultationschema_1.ConsultationRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Consultation request not found' });
        }
        // Mark the request as "removed"
        request.status = 'removed';
        const updatedRequest = await request.save();
        res.status(200).json(updatedRequest); // Return the updated request
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating consultation request', error });
    }
};
exports.deleteConsultationRequestById = deleteConsultationRequestById;
// Admin route to delete the consultation request using the testID
const deleteConsultationRequest = async (req, res) => {
    const { testID } = req.params;
    try {
        const consultationRequest = await consultationschema_1.ConsultationRequest.findOne({ testID });
        if (!consultationRequest) {
            return res.status(404).json({ message: 'Consultation request not found' });
        }
        // Delete the consultation request
        await consultationschema_1.ConsultationRequest.deleteOne({ testID });
        res.status(200).json({ message: 'Consultation request deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting consultation request',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.deleteConsultationRequest = deleteConsultationRequest;
const cancelConsultationRequest = async (req, res) => {
    const { testID } = req.params;
    try {
        const CancelConsultationRequestTestID = await consultationschema_1.ConsultationRequest.findOne({ testID });
        if (!CancelConsultationRequestTestID) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        // Update the status to "cancelled"
        CancelConsultationRequestTestID.status = 'cancelled';
        await CancelConsultationRequestTestID.save(); // Save the updated document
        res.status(200).json({ data: CancelConsultationRequestTestID });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.cancelConsultationRequest = cancelConsultationRequest;
const restoreConsultationRequest = async (req, res) => {
    const { testID } = req.params;
    try {
        const RestoreConsultationRequestTestID = await consultationschema_1.ConsultationRequest.findOne({ testID });
        if (!RestoreConsultationRequestTestID) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        // Update the status to "cancelled"
        RestoreConsultationRequestTestID.status = 'completed';
        await RestoreConsultationRequestTestID.save(); // Save the updated document
        res.status(200).json({ data: RestoreConsultationRequestTestID });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.restoreConsultationRequest = restoreConsultationRequest;
const archiveConsultationRequest = async (req, res) => {
    const { testID } = req.params;
    try {
        const ArchiveConsultationRequestTestID = await consultationschema_1.ConsultationRequest.findOne({ testID });
        if (!ArchiveConsultationRequestTestID) {
            res.status(404).json({ message: 'Test result not found' });
            return;
        }
        // Update the status to "cancelled"
        ArchiveConsultationRequestTestID.status = 'archived';
        await ArchiveConsultationRequestTestID.save(); // Save the updated document
        res.status(200).json({ data: ArchiveConsultationRequestTestID });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.archiveConsultationRequest = archiveConsultationRequest;
// Route to get archived consultations
const getArchivedConsultationsByUserID = async (req, res) => {
    const { userId } = req.params;
    try {
        // Modify the query to filter by both userId and status = 'archived'
        const ConsultationRequestUserID = await consultationschema_1.ConsultationRequest.find({
            userId,
            status: 'archived', // Filter by status as well
        });
        if (ConsultationRequestUserID.length === 0) {
            res.status(404).json({ message: 'No archived consultations found for this user' });
            return;
        }
        res.status(200).json({ data: ConsultationRequestUserID });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving archived consultations',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.getArchivedConsultationsByUserID = getArchivedConsultationsByUserID;
const getArchivedConsultations = async (req, res) => {
    try {
        // Fetch all consultations with status 'archived'
        const archivedConsultations = await consultationschema_1.ConsultationRequest.find({
            status: 'archived', // Filter by archived status
        });
        if (archivedConsultations.length === 0) {
            res.status(404).json({ message: 'No archived consultations found' });
            return;
        }
        res.status(200).json({ data: archivedConsultations });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving archived consultations',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.getArchivedConsultations = getArchivedConsultations;
// Mark consultation request as "Completed" using the ID
const markConsultationRequestAsDone = async (req, res) => {
    try {
        const request = await consultationschema_1.ConsultationRequest.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
        if (!request) {
            return res.status(404).json({ message: 'Consultation request not found' });
        }
        res.status(200).json(request); // Return the updated request
    }
    catch (error) {
        res.status(400).json({ message: 'Error marking consultation request as done', error });
    }
};
exports.markConsultationRequestAsDone = markConsultationRequestAsDone;
