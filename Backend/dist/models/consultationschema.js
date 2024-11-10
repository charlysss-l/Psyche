"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationRequest = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ConsultationRequestSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        match: /^[0-9]{8}$/, // Validate that userId is 8 digits
    },
    timeForConsultation: {
        type: String,
        required: true,
        match: /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/, // Validate time format (HH:mm)
    },
    note: {
        type: String,
        enum: ['IQ Test', 'Personality Test', 'Others'], // Only allow these three options
        required: true,
    },
    permissionForTestResults: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'declined'], // Status can only be one of these
    }
});
exports.ConsultationRequest = mongoose_1.default.model('ConsultationRequest', ConsultationRequestSchema);
