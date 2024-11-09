"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consultationcontroller_1 = require("../controllers/consultationcontroller");
const router = express_1.default.Router();
router.post('/', consultationcontroller_1.createConsultationRequest);
router.get('/', consultationcontroller_1.getConsultationRequests);
router.put('/:id/accept', consultationcontroller_1.acceptConsultationRequest);
router.delete('/:id/decline', consultationcontroller_1.declineConsultationRequest);
exports.default = router;
