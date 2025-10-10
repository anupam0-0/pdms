"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupExpiredFeaturedItems = exports.deleteFeaturedItem = exports.updateFeaturedItem = exports.createFeaturedItem = exports.getFeaturedItemById = exports.getActiveFeaturedItems = exports.getAllFeaturedItems = void 0;
const FeaturedItems_1 = __importDefault(require("../models/FeaturedItems"));
const Product_1 = __importDefault(require("../models/Product"));
const getAllFeaturedItems = async (req, res) => {
    try {
        const featuredItems = await FeaturedItems_1.default.find()
            .populate('item.product', 'name price category imageUrls')
            .sort({ createdAt: -1 });
        res.json(featuredItems);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching featured items', error });
    }
};
exports.getAllFeaturedItems = getAllFeaturedItems;
const getActiveFeaturedItems = async (req, res) => {
    try {
        const activeFeaturedItems = await FeaturedItems_1.default.find({
            'item.expiresOn': { $gt: new Date() }
        })
            .populate('item.product', 'name price category imageUrls')
            .sort({ createdAt: -1 });
        res.json(activeFeaturedItems);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching active featured items', error });
    }
};
exports.getActiveFeaturedItems = getActiveFeaturedItems;
const getFeaturedItemById = async (req, res) => {
    try {
        const featuredItem = await FeaturedItems_1.default.findById(req.params.id)
            .populate('item.product', 'name price category imageUrls');
        if (!featuredItem) {
            res.status(404).json({ message: 'Featured item not found' });
            return;
        }
        res.json(featuredItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching featured item', error });
    }
};
exports.getFeaturedItemById = getFeaturedItemById;
const createFeaturedItem = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        const { product, expiresOn } = req.body;
        const productExists = await Product_1.default.findById(product);
        if (!productExists) {
            res.status(400).json({ message: 'Product not found' });
            return;
        }
        const existingFeatured = await FeaturedItems_1.default.findOne({
            'item.product': product,
            'item.expiresOn': { $gt: new Date() }
        });
        if (existingFeatured) {
            res.status(400).json({
                message: 'Product is already featured and not expired'
            });
            return;
        }
        const featuredItemData = {
            item: {
                product,
                expiresOn: expiresOn || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        };
        const featuredItem = new FeaturedItems_1.default(featuredItemData);
        await featuredItem.save();
        const populatedFeaturedItem = await FeaturedItems_1.default.findById(featuredItem._id)
            .populate('item.product', 'name price category imageUrls');
        res.status(201).json(populatedFeaturedItem);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating featured item', error });
    }
};
exports.createFeaturedItem = createFeaturedItem;
const updateFeaturedItem = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        const featuredItem = await FeaturedItems_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('item.product', 'name price category imageUrls');
        if (!featuredItem) {
            res.status(404).json({ message: 'Featured item not found' });
            return;
        }
        res.json(featuredItem);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating featured item', error });
    }
};
exports.updateFeaturedItem = updateFeaturedItem;
const deleteFeaturedItem = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        const featuredItem = await FeaturedItems_1.default.findByIdAndDelete(req.params.id);
        if (!featuredItem) {
            res.status(404).json({ message: 'Featured item not found' });
            return;
        }
        res.json({ message: 'Featured item deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting featured item', error });
    }
};
exports.deleteFeaturedItem = deleteFeaturedItem;
const cleanupExpiredFeaturedItems = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        const result = await FeaturedItems_1.default.deleteMany({
            'item.expiresOn': { $lt: new Date() }
        });
        res.json({
            message: `Cleaned up ${result.deletedCount} expired featured items`
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error cleaning up expired items', error });
    }
};
exports.cleanupExpiredFeaturedItems = cleanupExpiredFeaturedItems;
//# sourceMappingURL=featuredItems.controller.js.map