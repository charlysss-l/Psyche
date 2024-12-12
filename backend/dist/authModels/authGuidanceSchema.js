"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserGuidanceSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const UserGuidance = (0, mongoose_1.model)('UserGuidance', UserGuidanceSchema);
exports.default = UserGuidance;
