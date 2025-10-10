"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockItems = exports.deleteInventory = exports.updateInventory = exports.createInventory = exports.getInventoryById = exports.getAllInventory = void 0;
const Inventory_1 = __importDefault(require("../models/Inventory"));
const Product_1 = __importDefault(require("../models/Product"));
const getAllInventory = async (req, res) => {
    try {
        let query = {};
        if (req.user?.role !== 'admin') {
            query.seller = req.user?._id;
        }
        const inventory = await Inventory_1.default.find(query)
            .populate('product', 'name price category imageUrls')
            .populate('seller', 'fullName email')
            .sort({ createdAt: -1 });
        res.json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};
exports.getAllInventory = getAllInventory;
const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory_1.default.findById(req.params.id)
            .populate('product', 'name price category imageUrls')
            .populate('seller', 'fullName email');
        if (!inventory) {
            res.status(404).json({ message: 'Inventory record not found' });
            return;
        }
        if (req.user?.role !== 'admin' && inventory.seller._id.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to view this inventory' });
            return;
        }
        res.json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};
exports.getInventoryById = getInventoryById;
const createInventory = async (req, res) => {
    try {
        const { product, stock, lowStockThreshold } = req.body;
        const productExists = await Product_1.default.findById(product);
        if (!productExists) {
            res.status(400).json({ message: 'Product not found' });
            return;
        }
        const existingInventory = await Inventory_1.default.findOne({
            product,
            seller: req.user?._id
        });
        if (existingInventory) {
            res.status(400).json({
                message: 'Inventory record already exists for this product'
            });
            return;
        }
        const inventoryData = {
            product,
            seller: req.user?._id,
            stock: stock || 0,
            lowStockThreshold: lowStockThreshold || 10
        };
        const inventory = new Inventory_1.default(inventoryData);
        await inventory.save();
        const populatedInventory = await Inventory_1.default.findById(inventory._id)
            .populate('product', 'name price category imageUrls')
            .populate('seller', 'fullName email');
        res.status(201).json(populatedInventory);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating inventory', error });
    }
};
exports.createInventory = createInventory;
const updateInventory = async (req, res) => {
    try {
        const inventory = await Inventory_1.default.findById(req.params.id);
        if (!inventory) {
            res.status(404).json({ message: 'Inventory record not found' });
            return;
        }
        if (req.user?.role !== 'admin' && inventory.seller.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to update this inventory' });
            return;
        }
        const updatedInventory = await Inventory_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('product', 'name price category imageUrls')
            .populate('seller', 'fullName email');
        res.json(updatedInventory);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating inventory', error });
    }
};
exports.updateInventory = updateInventory;
const deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory_1.default.findById(req.params.id);
        if (!inventory) {
            res.status(404).json({ message: 'Inventory record not found' });
            return;
        }
        if (req.user?.role !== 'admin' && inventory.seller.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to delete this inventory' });
            return;
        }
        await Inventory_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inventory record deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting inventory', error });
    }
};
exports.deleteInventory = deleteInventory;
const getLowStockItems = async (req, res) => {
    try {
        let query = {
            $expr: { $lte: ['$stock', '$lowStockThreshold'] }
        };
        if (req.user?.role !== 'admin') {
            query.seller = req.user?._id;
        }
        const lowStockItems = await Inventory_1.default.find(query)
            .populate('product', 'name price category imageUrls')
            .populate('seller', 'fullName email')
            .sort({ stock: 1 });
        res.json(lowStockItems);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching low stock items', error });
    }
};
exports.getLowStockItems = getLowStockItems;
//# sourceMappingURL=inventory.controller.js.map