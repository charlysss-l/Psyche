"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentNumber: { type: String, unique: true, required: true },
    userId: { type: String, required: true, unique: true, length: 8 },
});
const Student = (0, mongoose_1.model)('Student', StudentSchema);
exports.default = Student;
