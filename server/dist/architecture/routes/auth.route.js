"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_1.authMiddleware, auth_controller_1.logout);
router.get('/profile', auth_1.authMiddleware, auth_controller_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.route.js.map