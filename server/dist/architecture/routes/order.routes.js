"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', order_controller_1.getAllOrders);
router.get('/:id', order_controller_1.getOrderById);
router.post('/', order_controller_1.createOrder);
router.put('/:id/status', order_controller_1.updateOrderStatus);
router.put('/:id/cancel', order_controller_1.cancelOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map