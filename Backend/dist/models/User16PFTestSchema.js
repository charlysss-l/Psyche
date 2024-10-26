"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User16PFTestSchema = void 0;
const mongoose_1 = require("mongoose");
exports.User16PFTestSchema = new mongoose_1.Schema({
    userID: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        enum: ['Female', 'Male'],
        required: true
    },
    courseSection: {
        type: String,
        required: true
    },
    testID: {
        type: String,
        required: true,
    },
    responses: [{
            questionID: {
                type: String,
                required: true
            },
            selectedChoice: {
                type: String,
                required: true,
            },
            equivalentScore: {
                type: Number,
                required: true,
            }
        }],
    scoring: [{
            rawScore: {
                type: Number,
                required: true,
            },
            stenScore: {
                type: Number,
                required: true,
            }
        }],
    testType: {
        type: String,
        enum: ['Online', 'Physical'],
        required: true,
    }
});
exports.default = (0, mongoose_1.model)('User16PFTest', exports.User16PFTestSchema);
