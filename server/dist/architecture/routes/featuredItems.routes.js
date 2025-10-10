"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const featuredItems_controller_1 = require("../controllers/featuredItems.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', featuredItems_controller_1.getAllFeaturedItems);
router.get('/active', featuredItems_controller_1.getActiveFeaturedItems);
router.get('/:id', featuredItems_controller_1.getFeaturedItemById);
router.use(auth_1.authMiddleware);
router.post('/', featuredItems_controller_1.createFeaturedItem);
router.put('/:id', featuredItems_controller_1.updateFeaturedItem);
router.delete('/:id', featuredItems_controller_1.deleteFeaturedItem);
router.delete('/cleanup/expired', featuredItems_controller_1.cleanupExpiredFeaturedItems);
exports.default = router;
//# sourceMappingURL=featuredItems.routes.js.map