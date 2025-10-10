"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
const User_1 = __importDefault(require("../models/User"));
const hashPassword_1 = require("../../utils/hashPassword");
async function createUser(email, password, fullName) {
    const hashed = await (0, hashPassword_1.hashPassword)(password);
    return User_1.default.create({ email, password: hashed, fullName });
}
async function findUserByEmail(email) {
    return User_1.default.findOne({ email });
}
//# sourceMappingURL=auth.service.js.map