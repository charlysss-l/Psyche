"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const password = 'adminpsychology123*';
async function hashPassword() {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
}
hashPassword();
