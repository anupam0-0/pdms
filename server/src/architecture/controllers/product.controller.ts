import { Request, Response } from 'express';
import Product from '../models/Product';
import { authMiddleware } from '../../middlewares/auth';
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendNotFound,
  sendForbidden,
  sendServerError,
} from '../../utils/responseHelper';

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('seller', 'fullName email');
    sendSuccess(res, 'Products fetched successfully', products);
  } catch (error) {
    sendServerError(res, 'Error fetching products', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'fullName email');
    if (!product) {
      sendNotFound(res, 'Product not found', 'ProductNotFoundError');
      return;
    }
    sendSuccess(res, 'Product fetched successfully', product);
  } catch (error) {
    sendServerError(res, 'Error fetching product', error instanceof Error ? error.message : 'Unknown error');
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
    sendCreated(res, 'Product created successfully', product);
  } catch (error) {
    sendBadRequest(res, 'Error creating product', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Update product (seller only)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      sendNotFound(res, 'Product not found', 'ProductNotFoundError');
      return;
    }
    
    // Check if user is the seller or admin
    if (product.seller.toString() !== (req.user as any)?._id.toString() && req.user?.role !== 'admin') {
      sendForbidden(res, 'Not authorized to update this product', 'UnauthorizedError');
      return;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    sendSuccess(res, 'Product updated successfully', updatedProduct);
  } catch (error) {
    sendBadRequest(res, 'Error updating product', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Delete product (seller only)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      sendNotFound(res, 'Product not found', 'ProductNotFoundError');
      return;
    }
    
    // Check if user is the seller or admin
    if (product.seller.toString() !== (req.user as any)?._id.toString() && req.user?.role !== 'admin') {
      sendForbidden(res, 'Not authorized to delete this product', 'UnauthorizedError');
      return;
    }
    
    await Product.findByIdAndDelete(req.params.id);
    sendSuccess(res, 'Product deleted successfully');
  } catch (error) {
    sendServerError(res, 'Error deleting product', error instanceof Error ? error.message : 'Unknown error');
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
    sendSuccess(res, 'Products searched successfully', products);
  } catch (error) {
    sendServerError(res, 'Error searching products', error instanceof Error ? error.message : 'Unknown error');
  }
};
