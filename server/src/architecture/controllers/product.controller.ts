import { Request, Response } from 'express';
import Product from '../models/Product';
import { authMiddleware } from '../../middlewares/auth';

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('seller', 'fullName email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'fullName email');
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Create new product (seller only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user?._id
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// Update product (seller only)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    // Check if user is the seller or admin
    if (product.seller.toString() !== (req.user as any)?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this product' });
      return;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

// Delete product (seller only)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    // Check if user is the seller or admin
    if (product.seller.toString() !== (req.user as any)?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this product' });
      return;
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    let query: any = {};
    
    if (q) {
      query.$text = { $search: q as string };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(query).populate('seller', 'fullName email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error });
  }
};
