import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
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

// Get all inventory (seller sees their own, admin sees all)
export const getAllInventory = async (req: Request, res: Response) => {
  try {
    let query: any = {};
    
    // If user is not admin, only show their own inventory
    if (req.user?.role !== 'admin') {
      query.seller = req.user?._id;
    }
    
    const inventory = await Inventory.find(query)
      .populate('product', 'name price category imageUrls')
      .populate('seller', 'fullName email')
      .sort({ createdAt: -1 });
    
    sendSuccess(res, 'Inventory fetched successfully', inventory);
  } catch (error) {
    sendServerError(res, 'Error fetching inventory', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Get inventory by ID
export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('product', 'name price category imageUrls')
      .populate('seller', 'fullName email');
    
    if (!inventory) {
      sendNotFound(res, 'Inventory record not found', 'InventoryNotFoundError');
      return;
    }
    
    // Check if user can view this inventory
    if (req.user?.role !== 'admin' && inventory.seller._id.toString() !== (req.user as any)?._id.toString()) {
      sendForbidden(res, 'Not authorized to view this inventory', 'UnauthorizedError');
      return;
    }
    
    sendSuccess(res, 'Inventory fetched successfully', inventory);
  } catch (error) {
    sendServerError(res, 'Error fetching inventory', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Create new inventory record
export const createInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, stock, lowStockThreshold } = req.body;
    
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      sendBadRequest(res, 'Product not found', 'ProductNotFoundError');
      return;
    }
    
    // Check if inventory already exists for this product-seller combination
    const existingInventory = await Inventory.findOne({ 
      product, 
      seller: (req.user as any)?._id 
    });
    
    if (existingInventory) {
      sendBadRequest(res, 'Inventory record already exists for this product', 'InventoryExistsError');
      return;
    }
    
    const inventoryData = {
      product,
      seller: (req.user as any)?._id,
      stock: stock || 0,
      lowStockThreshold: lowStockThreshold || 10
    };
    
    const inventory = new Inventory(inventoryData);
    await inventory.save();
    
    const populatedInventory = await Inventory.findById(inventory._id)
      .populate('product', 'name price category imageUrls')
      .populate('seller', 'fullName email');
    
    sendCreated(res, 'Inventory record created successfully', populatedInventory);
  } catch (error) {
    sendBadRequest(res, 'Error creating inventory', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Update inventory
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      sendNotFound(res, 'Inventory record not found', 'InventoryNotFoundError');
      return;
    }
    
    // Check if user can update this inventory
    if (req.user?.role !== 'admin' && inventory.seller.toString() !== (req.user as any)?._id.toString()) {
      sendForbidden(res, 'Not authorized to update this inventory', 'UnauthorizedError');
      return;
    }
    
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product', 'name price category imageUrls')
     .populate('seller', 'fullName email');
    
    sendSuccess(res, 'Inventory updated successfully', updatedInventory);
  } catch (error) {
    sendBadRequest(res, 'Error updating inventory', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Delete inventory
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      sendNotFound(res, 'Inventory record not found', 'InventoryNotFoundError');
      return;
    }
    
    // Check if user can delete this inventory
    if (req.user?.role !== 'admin' && inventory.seller.toString() !== (req.user as any)?._id.toString()) {
      sendForbidden(res, 'Not authorized to delete this inventory', 'UnauthorizedError');
      return;
    }
    
    await Inventory.findByIdAndDelete(req.params.id);
    sendSuccess(res, 'Inventory record deleted successfully');
  } catch (error) {
    sendServerError(res, 'Error deleting inventory', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Get low stock items
export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    let query: any = {
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    };
    
    // If user is not admin, only show their own low stock items
    if (req.user?.role !== 'admin') {
      query.seller = req.user?._id;
    }
    
    const lowStockItems = await Inventory.find(query)
      .populate('product', 'name price category imageUrls')
      .populate('seller', 'fullName email')
      .sort({ stock: 1 });
    
    sendSuccess(res, 'Low stock items fetched successfully', lowStockItems);
  } catch (error) {
    sendServerError(res, 'Error fetching low stock items', error instanceof Error ? error.message : 'Unknown error');
  }
};
