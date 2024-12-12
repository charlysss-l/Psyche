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
    },
    timeForConsultation: {
        type: String,
        required: true,
    },
    testID: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        enum: ['IQ Test (Online)', 'IQ Test (Physical)', 'Personality Test (Online)', 'Personality Test (Physical)', 'Others'], // Only allow these options
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed', 'deleted', 'removed', 'archived'], // Status can only be one of these
    },
    message: {
        type: String,
        required: true,
    },
    firstName: {
        type: String, // Optional field
    },
    lastName: {
        type: String, // Optional field
    },
    age: {
        type: Number, // Optional field
    },
    sex: {
        type: String,
    },
    course: {
        type: String, // Optional field
    },
    year: {
        type: Number,
    },
    section: {
        type: Number,
    },
    reasonForConsultation: {
        type: String, // Optional field
    },
});
exports.ConsultationRequest = mongoose_1.default.model('ConsultationRequest', ConsultationRequestSchema);
