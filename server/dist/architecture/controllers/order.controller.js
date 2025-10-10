"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getAllOrders = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const getAllOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user?.role !== 'admin') {
            query.customer = req.user?._id;
        }
        const orders = await Order_1.default.find(query)
            .populate('customer', 'fullName email')
            .populate('items.product', 'name price imageUrls')
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id)
            .populate('customer', 'fullName email')
            .populate('items.product', 'name price imageUrls');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (req.user?.role !== 'admin' && order.customer._id.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to view this order' });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};
exports.getOrderById = getOrderById;
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;
        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product_1.default.findById(item.product);
            if (!product) {
                res.status(400).json({ message: `Product ${item.product} not found` });
                return;
            }
            const inventory = await Inventory_1.default.findOne({
                product: item.product,
                seller: product.seller
            });
            if (!inventory || inventory.stock < item.quantity) {
                res.status(400).json({
                    message: `Insufficient stock for product ${product.name}`
                });
                return;
            }
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            orderItems.push({
                product: item.product,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });
        }
        const orderData = {
            customer: req.user?._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod'
        };
        const order = new Order_1.default(orderData);
        await order.save();
        for (const item of orderItems) {
            await Inventory_1.default.findOneAndUpdate({ product: item.product }, { $inc: { stock: -item.quantity } });
        }
        const populatedOrder = await Order_1.default.findById(order._id)
            .populate('customer', 'fullName email')
            .populate('items.product', 'name price imageUrls');
        res.status(201).json(populatedOrder);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating order', error });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        const { status } = req.body;
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).populate('customer', 'fullName email')
            .populate('items.product', 'name price imageUrls');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating order status', error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const cancelOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (req.user?.role !== 'admin' && order.customer.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to cancel this order' });
            return;
        }
        if (!['pending', 'processing'].includes(order.status)) {
            res.status(400).json({
                message: 'Order cannot be cancelled in current status'
            });
            return;
        }
        order.status = 'cancelled';
        await order.save();
        for (const item of order.items) {
            await Inventory_1.default.findOneAndUpdate({ product: item.product }, { $inc: { stock: item.quantity } });
        }
        res.json({ message: 'Order cancelled successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error cancelling order', error });
    }
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=order.controller.js.map