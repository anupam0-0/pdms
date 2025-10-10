import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import Product from '../models/Product';
import { authMiddleware } from '../../middlewares/auth';

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
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error });
  }
};

// Get inventory by ID
export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('product', 'name price category imageUrls')
      .populate('seller', 'fullName email');
    
    if (!inventory) {
      res.status(404).json({ message: 'Inventory record not found' });
      return;
    }
    
    // Check if user can view this inventory
    if (req.user?.role !== 'admin' && inventory.seller._id.toString() !== (req.user as any)?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to view this inventory' });
      return;
    }
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error });
  }
};

// Create new inventory record
export const createInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, stock, lowStockThreshold } = req.body;
    
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      res.status(400).json({ message: 'Product not found' });
      return;
    }
    
    // Check if inventory already exists for this product-seller combination
    const existingInventory = await Inventory.findOne({ 
      product, 
      seller: (req.user as any)?._id 
    });
    
    if (existingInventory) {
      res.status(400).json({ 
        message: 'Inventory record already exists for this product' 
      });
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
    
    res.status(201).json(populatedInventory);
  } catch (error) {
    res.status(400).json({ message: 'Error creating inventory', error });
  }
};

// Update inventory
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      res.status(404).json({ message: 'Inventory record not found' });
      return;
    }
    
    // Check if user can update this inventory
    if (req.user?.role !== 'admin' && inventory.seller.toString() !== (req.user as any)?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this inventory' });
      return;
    }
    
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product', 'name price category imageUrls')
     .populate('seller', 'fullName email');
    
    res.json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: 'Error updating inventory', error });
  }
};

// Delete inventory
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      res.status(404).json({ message: 'Inventory record not found' });
      return;
    }
    
    // Check if user can delete this inventory
    if (req.user?.role !== 'admin' && inventory.seller.toString() !== (req.user as any)?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this inventory' });
      return;
    }
    
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inventory record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory', error });
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
    
    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock items', error });
  }
};
