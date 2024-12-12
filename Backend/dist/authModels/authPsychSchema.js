"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// authPsychSchema.ts
const mongoose_1 = require("mongoose");
const UserPsychSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const UserPsych = (0, mongoose_1.model)('UserPsych', UserPsychSchema);
exports.default = UserPsych;
