"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineConsultationRequest = exports.acceptConsultationRequest = exports.getConsultationRequests = exports.createConsultationRequest = void 0;
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
        await consultationschema_1.ConsultationRequest.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: 'Error' });
    }
};
exports.declineConsultationRequest = declineConsultationRequest;
