"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', product_controller_1.getAllProducts);
router.get('/search', product_controller_1.searchProducts);
router.get('/:id', product_controller_1.getProductById);
router.post('/', auth_1.authMiddleware, product_controller_1.createProduct);
router.put('/:id', auth_1.authMiddleware, product_controller_1.updateProduct);
router.delete('/:id', auth_1.authMiddleware, product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.routes.js.map