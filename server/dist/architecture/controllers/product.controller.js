"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const getAllProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find().populate('seller', 'fullName email');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id).populate('seller', 'fullName email');
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            seller: req.user?._id
        };
        const product = new Product_1.default(productData);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        if (product.seller.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized to update this product' });
            return;
        }
        const updatedProduct = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        if (product.seller.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized to delete this product' });
            return;
        }
        await Product_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};
exports.deleteProduct = deleteProduct;
const searchProducts = async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;
        let query = {};
        if (q) {
            query.$text = { $search: q };
        }
        if (category) {
            query.category = category;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        const products = await Product_1.default.find(query).populate('seller', 'fullName email');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error searching products', error });
    }
};
exports.searchProducts = searchProducts;
//# sourceMappingURL=product.controller.js.map